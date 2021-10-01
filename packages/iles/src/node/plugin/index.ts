/* eslint-disable no-restricted-syntax */
import { resolve, relative } from 'path'
import fs from 'fs'
import { green } from 'nanocolors'
import type { PluginOption, ResolvedConfig, ResolveFn, ViteDevServer } from 'vite'
import { transformWithEsbuild } from 'vite'

import vue from '@vitejs/plugin-vue'
import { MODULE_ID_VIRTUAL as PAGES_REQUEST_PATH } from 'vite-plugin-pages'
import components from 'unplugin-vue-components/vite'
import vueJsx from '@vitejs/plugin-vue-jsx'

import type { Frontmatter } from '@islands/frontmatter'
import createDebugger from 'debug'
import type { AppConfig, AppClientConfig } from '../shared'
import { APP_PATH, ROUTES_REQUEST_PATH, USER_APP_REQUEST_PATH, APP_CONFIG_REQUEST_PATH } from '../alias'
import { createServer } from '../server'
import { escapeRegex, serialize, replaceAsync } from './utils'
import { parseId, parseImports } from './parse'
import { unresolvedIslandKey, wrapIslandsInSFC } from './wrap'

const debug = {
  config: createDebugger('iles:config'),
  mdx: createDebugger('iles:mdx'),
  detect: createDebugger('iles:detect'),
  resolve: createDebugger('iles:resolve'),
  build: createDebugger('iles:build'),
}

function isMarkdown (path: string) {
  return path.endsWith('.mdx') || path.endsWith('.md')
}

function isSFCMain (path: string, query: Record<string, any>) {
  return path.endsWith('.vue') && query.vue === undefined
}

const contextComponentRegex = new RegExp(escapeRegex('_ctx.__unplugin_components_'), 'g')
const viteIslandRegex = new RegExp(`"?${escapeRegex(unresolvedIslandKey)}"?:\\s*([^,}\n]+)[,}\n]`, 'sg')
const unresolvedComponentsRegex = /_resolveComponent\("([^)]+?)"\)/

// Public: Configures MDX, Vue, Components, and Islands plugins.
export default function IslandsPlugins (appConfig: AppConfig): PluginOption[] {
  debug.config(appConfig)

  let base: ResolvedConfig['base']
  let mode: ResolvedConfig['mode']
  let root: ResolvedConfig['root']
  let resolveVitePath: ResolveFn

  const appPath = resolve(appConfig.srcDir, 'app.ts')

  const plugins = appConfig.namedPlugins

  return [
    {
      name: 'iles',
      enforce: 'pre',
      configResolved (config) {
        if (base) return
        base = config.base
        mode = config.mode
        root = config.root
        resolveVitePath = config.createResolver()
      },
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
          const { base, debug, router, root, ssg } = appConfig
          const clientConfig: AppClientConfig = { base, debug, router, root, ssg }
          return `export default ${serialize(clientConfig)}`
        }

        if (id === USER_APP_REQUEST_PATH) {
          if (!fs.existsSync(appPath)) return 'export default {}'
          this.addWatchFile(appPath)
          return transformWithEsbuild(fs.readFileSync(appPath, 'utf-8'), appPath)
        }
      },
      handleHotUpdate ({ file, server }) {
        if (file === appPath) return [server.moduleGraph.getModuleById(USER_APP_REQUEST_PATH)!]
      },
      // Allows to do a glob import in 'src/client/app/layouts.ts'
      transform (code, id) {
        if (id.includes('client/app/layouts'))
          return code.replace(/__LAYOUTS_ROOT__/g, `/${relative(root, appConfig.layoutsDir)}`)

        // TODO: Layout transformation Vue: move to separate plugin
        // TODO: Layout from frontmatter should be used, fail if both are specified.
        const { path } = parseId(id)
        if (plugins.pages.api.pageForFile(path) || path.includes(appConfig.layoutsDir)) {
          const isTypeScript = /lang=['"]ts['"]/.test(code)
          return code.replace(/<template(.*?)layout=\s*['"](\w+)['"](.*?)>/, (_, beforeAttrs, layoutName, afterAttrs) => {
            return `<script${isTypeScript ? ' lang="ts"' : ''}>
${layoutName === 'false' ? 'const __iles_layout = false' : `import __iles_layout from '/${relative(root, appConfig.layoutsDir)}/${layoutName}.vue'`}
</script>
<template${beforeAttrs}${afterAttrs}>
`
          })
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
      name: 'iles:detect-islands-in-vue',
      enforce: 'pre',
      async transform (code, id) {
        const { path } = parseId(id)
        if (path.endsWith('.vue') && code.includes('client:') && code.includes('<template'))
          return wrapIslandsInSFC(code, path, debug.detect)
      },
    },

    vue(appConfig.vue),

    plugins.markdown,

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
  ...meta,
  ...frontmatter,
  layout,
  meta,
  frontmatter,
  props: {
    components: { type: Object, default: () => ({}) },
  },
  render () {
    return MDXContent({ ...this.$props, ...this.$attrs })
  },
})
export const render = MDXContent
export default _default`)
      },
    },

    vueJsx(appConfig.vueJsx),

    // https://github.com/hannoeru/vite-plugin-pages
    plugins.pages,

    // https://github.com/antfu/unplugin-vue-components
    components(appConfig.components),

    {
      name: 'iles:page-hmr',
      apply: 'serve',
      enforce: 'post',
      // HMR for frontmatter changes.
      async transform (code, id) {
        const { path, query } = parseId(id)
        if (isSFCMain(path, query) || path.endsWith('.mdx')) {
          return `${code}
import.meta.hot.accept('/${relative(root, path)}', () => __ILES_ROUTE__.forceUpdate())
`
        }
      },
    },

    {
      name: 'iles:resolve-islands',
      enforce: 'post',
      async transform (code, id) {
        const { path, query } = parseId(id)
        if (!isMarkdown(path) && !isSFCMain(path, query)) return

        if (path.endsWith('.vue')) {
          const resolvedPage = plugins.pages.api.pageForFile(path)
          if (resolvedPage) {
            const { path: href, meta: blockMeta = {}, ...blockAttrs } = resolvedPage.customBlock || {} as Frontmatter
            const rawMatter = { meta: { ...blockMeta, href }, ...blockAttrs }
            const { meta, ...frontmatter } = appConfig.markdown?.extendFrontmatter?.(rawMatter, path) || rawMatter

            code = `${code}
_sfc_main.meta = ${serialize(meta)}
_sfc_main.frontmatter = ${serialize(frontmatter)}
`
          }
          if (code.includes('__iles_layout'))
            code = `${code}\n_sfc_main.layout = __iles_layout\n`
        }

        code = code.replace(contextComponentRegex, '__unplugin_components_')

        if (!code.includes(unresolvedIslandKey)) return code

        const imports = await parseImports(code)

        code = await replaceAsync(code, viteIslandRegex, async (str, resolvedName) => {
          resolvedName = resolvedName.replace(/^\$setup\./, '')
          const componentName = resolvedName.match(unresolvedComponentsRegex)?.[1] || resolvedName
          const importMetadata = imports[componentName]

          if (!importMetadata)
            throw new Error(`Unable to infer '${componentName}' island component in ${path}`)

          debug.resolve(`${componentName} => ${importMetadata.path}`)

          return `
component: ${componentName},
importName: '${importMetadata.name}',
importPath: '${await resolveVitePath(importMetadata.path, path)}',
          `.replace(/\n/g, ' ')
        })

        if (isMarkdown(path)) {
          const componentName = code.match(unresolvedComponentsRegex)?.[1]
          if (componentName)
            throw new Error(`Unable to infer '${componentName}' component in ${path}`)
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
        green(
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
