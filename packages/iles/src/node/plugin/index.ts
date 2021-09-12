/* eslint-disable no-restricted-syntax */
import { resolve, relative } from 'path'
import fs from 'fs'
import { yellow } from 'chalk'
import type { PluginOption, ResolvedConfig, ResolveFn } from 'vite'

import vue from '@vitejs/plugin-vue'
import pages, { MODULE_ID_VIRTUAL as PAGES_REQUEST_PATH } from 'vite-plugin-pages'
import components from 'unplugin-vue-components/vite'
import vueJsx from '@vitejs/plugin-vue-jsx'
import xdm from 'vite-plugin-xdm'

import createDebugger from 'debug'
import type { AppConfig, AppClientConfig } from '../shared'
import { APP_PATH, ROUTES_REQUEST_PATH, USER_APP_REQUEST_PATH, APP_CONFIG_REQUEST_PATH } from '../alias'
import { escapeRegex, pascalCase, serialize } from './utils'
import { parseImports } from './parse'

const debug = {
  config: createDebugger('iles:config'),
  mdx: createDebugger('iles:mdx'),
  wrap: createDebugger('iles:wrap'),
  resolve: createDebugger('iles:resolve'),
  build: createDebugger('iles:build'),
}

function parseId (id: string) {
  const index = id.indexOf('?')
  if (index < 0) {
    return { path: id, query: {} }
  }
  else {
    // @ts-ignore
    const query = Object.fromEntries(new URLSearchParams(id.slice(index)))
    return {
      path: id.slice(0, index),
      query,
    }
  }
}

function isMarkdown (path: string) {
  return path.endsWith('.mdx') || path.endsWith('.md')
}

async function replaceAsync (str: string, regex: RegExp, asyncFn: (...groups: string[]) => Promise<string>) {
  const promises = Array.from(str.matchAll(regex))
    .map(([match, ...args]) => asyncFn(match, ...args))
  const replacements = await Promise.all(promises)
  return str.replace(regex, () => replacements.shift()!)
}

const contextComponentRegex = new RegExp(escapeRegex('_ctx.__unplugin_components_'), 'g')
const unresolvedIslandKey = '__viteIslandComponent'
const viteIslandRegex = new RegExp(`"?${escapeRegex(unresolvedIslandKey)}"?:\\s*([^,]+),`, 'sg')
const scriptTagsRegex = /<script\s*([^>]*?)>(.*?)<\/script>/sg

// Public: Configures MDX, Vue, Components, and Islands plugins.
export default function IslandsPlugins (appConfig: AppConfig): PluginOption[] {
  debug.config(appConfig)

  let base: ResolvedConfig['base']
  let assetsDir: ResolvedConfig['build']['assetsDir']
  let outDir: ResolvedConfig['build']['outDir']
  let mode: ResolvedConfig['mode']
  let root: ResolvedConfig['root']
  let configFile: ResolvedConfig['configFile']
  let resolveVitePath: ResolveFn

  return [
    {
      name: 'islands',
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
      transform (code, id) {
        return code.replace(/__LAYOUTS_ROOT__/g, '/src/layouts')
      },
      handleHotUpdate ({ file }) {
        // TODO: Implement server auto-restart
        if (file === appConfig.configPath && configFile)
          console.warn(yellow('[iles]: config file has changed. Please restart the dev server.'))
      },
      configureServer (server) {
        if (appConfig.configPath) server.watcher.add(appConfig.configPath)

        // serve our index.html after vite history fallback
        return () => {
          server.middlewares.use((req, res, next) => {
            if (req.url!.endsWith('.html')) {
              res.statusCode = 200
              res.end(`
  <!DOCTYPE html>
  <html>
    <head>
      <title></title>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width,initial-scale=1">
      <meta name="description" content="">
    </head>
    <body>
      <div id="app"></div>
      <script type="module" src="/@fs/${APP_PATH}/index.js"></script>
    </body>
  </html>`)
              return
            }
            next()
          })
        }
      },
    },
    {
      name: 'islands:wrap-components',
      enforce: 'pre',
      configResolved (config) {
        debug.build('minify:', config.build.minify)
        if (base) return
        base = config.base
        assetsDir = config.build.assetsDir
        outDir = config.build.outDir
        mode = config.mode
        root = config.root
        configFile = config.configFile
        resolveVitePath = config.createResolver()
        debug.wrap({ outDir, assetsDir })
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
    xdm(appConfig.markdown),

    {
      name: 'islands:mdx',
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

        // Set path to the specified page.
        // TODO: Add option in vite-plugin-xdm to extend frontmatter, like Jekyll.
        const href = relative(root, path).replace(/\.\w+$/, '').replace('src/pages/', '/')

        // TODO: Allow component to receive an excerpt prop.
        return code.replace('export default MDXContent', `
          ${code.includes(' defineComponent') ? '' : 'import { defineComponent } from \'vue\''}

          export const href = '${href}'
          frontmatter.href = href

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
          export const content = _default
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
      name: 'islands:import-analysis',
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
