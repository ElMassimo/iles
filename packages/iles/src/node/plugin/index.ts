/* eslint-disable no-restricted-syntax */
import { resolve, relative } from 'path'
import fs from 'fs'
import chalk from 'chalk'
import type { PluginOption, ResolvedConfig, ResolveFn, ViteDevServer } from 'vite'

import vue from '@vitejs/plugin-vue'
import pages, { MODULE_ID_VIRTUAL as PAGES_REQUEST_PATH } from 'vite-plugin-pages'
import components from 'unplugin-vue-components/vite'
import vueJsx from '@vitejs/plugin-vue-jsx'
import xdm from 'vite-plugin-xdm'
import MagicString from 'magic-string'

import createDebugger from 'debug'
import type { AppConfig, AppClientConfig } from '../shared'
import { APP_PATH, ROUTES_REQUEST_PATH, USER_APP_REQUEST_PATH, APP_CONFIG_REQUEST_PATH } from '../alias'
import { createServer } from '../server'
import { escapeRegex, pascalCase, serialize, replaceAsync } from './utils'
import { parseId, parseImports } from './parse'

const debug = {
  config: createDebugger('iles:config'),
  mdx: createDebugger('iles:mdx'),
  wrap: createDebugger('iles:wrap'),
  resolve: createDebugger('iles:resolve'),
  build: createDebugger('iles:build'),
}

function isMarkdown (path: string) {
  return path.endsWith('.mdx') || path.endsWith('.md')
}

const contextComponentRegex = new RegExp(escapeRegex('_ctx.__unplugin_components_'), 'g')
const unresolvedIslandKey = '__viteIslandComponent'
const viteIslandRegex = new RegExp(`"?${escapeRegex(unresolvedIslandKey)}"?:\\s*([^,]+),`, 'sg')
const scriptTagsRegex = /<script\s*([^>]*?)>(.*?)<\/script>/sg

// Public: Configures MDX, Vue, Components, and Islands plugins.
export default function IslandsPlugins (appConfig: AppConfig): PluginOption[] {
  debug.config(appConfig)

  let base: ResolvedConfig['base']
  let sourcemap: ResolvedConfig['build']['sourcemap']
  let mode: ResolvedConfig['mode']
  let root: ResolvedConfig['root']
  let resolveVitePath: ResolveFn

  return [
    {
      name: 'iles',
      enforce: 'pre',
      resolveId (id) {
        if (id === ROUTES_REQUEST_PATH)
          return PAGES_REQUEST_PATH

        if (id === USER_APP_REQUEST_PATH)
          return USER_APP_REQUEST_PATH

        if (id === APP_CONFIG_REQUEST_PATH)
          return APP_CONFIG_REQUEST_PATH
      },
      load (id) {
        if (id === APP_CONFIG_REQUEST_PATH) {
          const { base, debug, router, root } = appConfig
          const clientConfig: AppClientConfig = { base, debug, router, root }
          return `export default ${serialize(clientConfig)}`
        }

        if (id === USER_APP_REQUEST_PATH) {
          const appPath = resolve(appConfig.srcDir, 'app.ts')
          if (!fs.existsSync(appPath)) return 'export default {}'
          this.addWatchFile(appPath)
          return fs.readFileSync(appPath, 'utf-8')
        }
      },
      // Allows to do a glob import in 'src/client/app/layouts.ts'
      transform (code, id) {
        if (id.includes('client/app/layouts')) {
          code = code.replace(/__LAYOUTS_ROOT__/g, `/${relative(root, appConfig.layoutsDir)}`)
          return code
        }
      },
      configureServer (server) {
        restartOnConfigChanges(appConfig, server)

        // serve our index.html after vite history fallback
        return () => {
          server.middlewares.use((req, res, next) => {
            // if (req.url!.endsWith('.html')) {
            res.statusCode = 200
            res.end(`
<!DOCTYPE html>
<html>
  <body>
    <div id="app"></div>
    <script type="module" src="/@fs/${APP_PATH}/index.js"></script>
  </body>
</html>`)
          })
        }
      },
    },
    {
      name: 'iles:wrap-components',
      enforce: 'pre',
      configResolved (config) {
        debug.build('minify:', config.build.minify)
        if (base) return
        base = config.base
        sourcemap = config.build.sourcemap
        mode = config.mode
        root = config.root
        resolveVitePath = config.createResolver()
      },
      async transform (code, id) {
        const { path } = parseId(id)
        if (!isMarkdown(path) && !path.endsWith('.vue')) return

        const components = /<([A-Z]\w+)\s*(?:([^/]+?)\/>|([^>]+)>(.*?)<\/\1>)/sg

        // Parse imports and set options as needed.
        const scriptContent = path.endsWith('.vue') && Array.from(code.matchAll(scriptTagsRegex)).map(([,, js]) => js).join(';')
        const imports = scriptContent
          ? await parseImports(scriptContent)
          : {}

        return code.replace(components, (str, tagName, attrs, otherAttrs, children) => {
          if (otherAttrs) attrs = otherAttrs
          if (!attrs?.match(/(\s|^)client:/)) return str

          debug.wrap(tagName, attrs)

          const resolveComponent = imports[tagName] ? tagName : `_resolveComponent("${tagName}")`
          const component = path.endsWith('.vue')
            ? `:${unresolvedIslandKey}='${resolveComponent}'`
            : `${unresolvedIslandKey}={${resolveComponent}}`

          return `<ViteIsland componentName="${pascalCase(tagName)}" ${component} ${attrs}>${children || ''}</ViteIsland>`
        })
      },
    },

    vue(appConfig.vue),

    {
      name: 'iles:mdx:pre',
      async transform (code, id) {
        const { path } = parseId(id)
        if (!isMarkdown(path)) return null

        // TODO: Use pages plugin to obtain the path pages.pathForFile(path)
        const href = relative(root, path).replace(/\.\w+$/, '').replace('src/pages/', '/')
        const s = new MagicString(code)

        const marker = '---\n'
        if (code.startsWith(marker))
          s.appendRight(marker.length, `href: '${href}'\n`)
        else
          s.prepend(`---\nhref: '${href}'\n---\n`)

        return { code: s.toString(), map: sourcemap ? s.generateMap({ hires: true }) : null }
      },
    },

    xdm(appConfig.markdown),

    {
      name: 'iles:mdx:pos',
      async transform (code, id) {
        const { path } = parseId(id)
        if (!isMarkdown(path) || !code.includes('MDXContent')) return null

        const match = code.match(/props\.components\), \{(.*?), wrapper: /)
        const importedComponents = match ? match[1].split(', ') : []
        debug.mdx(`transforming (${importedComponents.length})`, importedComponents)

        const pattern = '_components = Object.assign({'
        const index = code.indexOf(pattern) + pattern.length
        const comps = importedComponents.map(name => `    ${name}: _resolveComponent("${name}"),`).join('\n')
        code = `${code.slice(0, index)}\n${comps}\n${code.slice(index, code.length + 1)}`

        // Allow mdx pages with only frontmatter.
        code = code.replace('_content = <></>', '_content = null')

        // Allow MDX content to be rendered without args.
        code = code.replace('MDXContent(props)', 'MDXContent(props = {})')

        // TODO: Allow component to receive an excerpt prop.
        return code.replace('export default MDXContent', `
          ${code.includes(' defineComponent') ? '' : 'import { defineComponent } from \'vue\''}

          const _default = defineComponent({
            ${mode === 'development' ? `__file: '${path}',` : ''}
            ...frontmatter,
            frontmatter,
            props: {
              components: { type: Object, default: () => ({}) },
            },
            render () {
              return MDXContent({ ...this.$props, ...this.$attrs })
            },
          })
          export const render = MDXContent
          export default _default
        `)
      },
    },

    vueJsx(appConfig.vueJsx),

    // https://github.com/hannoeru/vite-plugin-pages
    pages(appConfig.pages),

    // https://github.com/antfu/unplugin-vue-components
    components(appConfig.components),

    {
      name: 'iles:import-analysis',
      enforce: 'post',
      async transform (code, id) {
        const { path, query } = parseId(id)
        if (!isMarkdown(path) && !path.endsWith('.vue')) return

        if (path.includes('src/pages/') && path.endsWith('.vue') && !query.type) {
          // Set path to the specified page.
          // TODO: Unify with MDX
          const href = relative(root, path).replace(/\.\w+$/, '').replace('src/pages/', '/')
            .replace(/\/index$/, '/')
          code = `${code}\nexport const href = '${href}'`
        }

        code = code.replace(contextComponentRegex, '__unplugin_components_')

        if (!code.includes(unresolvedIslandKey)) return code

        const imports = await parseImports(code)
        code = await replaceAsync(code, viteIslandRegex, async (str, resolvedName) => {
          resolvedName = resolvedName.replace(/^\$setup\./, '')
          const importMetadata = imports[resolvedName]

          const componentName = resolvedName.match(/_resolveComponent\(([^)]+?)\)/)?.[1]

          if (!importMetadata)
            throw new Error(`Unable to infer '${componentName}' island component in ${path}`)

          debug.resolve(`${componentName} => ${importMetadata.path}`)

          return `
            component: ${resolvedName},
            importName: '${importMetadata.name}',
            importPath: '${await resolveVitePath(importMetadata.path, path)}',
          `
        })

        if (isMarkdown(path)) {
          const name = code.match(/_resolveComponent\(([^)]+?)\)/)?.[1]
          if (name)
            throw new Error(`Unable to infer '${name}' component in ${path}`)
        }

        return code
      },
    },
  ]
}

async function restartOnConfigChanges (config: AppConfig, server: ViteDevServer) {
  const restartIfConfigChanged = async (path: string) => {
    if (path === config.configPath) {
      server.config.logger.info(
        chalk.green(
          `${relative(process.cwd(), config.configPath)} changed, restarting server...`,
        ),
        { clear: true, timestamp: true },
      )
      await server.close()
      // @ts-ignore
      global.__vite_start_time = Date.now()
      const { server: newServer } = await createServer(server.config.root, server.config.server)
      await newServer.listen()
    }
  }
  // Shut down the server and start a new one if config changes.
  server.watcher.add(config.configPath)
  server.watcher.on('add', restartIfConfigChanged)
  server.watcher.on('change', restartIfConfigChanged)
}
