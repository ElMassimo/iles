/* eslint-disable no-restricted-syntax */
import { promises as fs } from 'fs'
import { basename, resolve, relative } from 'pathe'
import { green } from 'nanocolors'
import type { PluginOption, ResolvedConfig, ResolveFn, ViteDevServer } from 'vite'
import { transformWithEsbuild } from 'vite'

import { MODULE_ID_VIRTUAL as PAGES_REQUEST_PATH } from 'vite-plugin-pages'
import MagicString from 'magic-string'

import type { Frontmatter } from '@islands/frontmatter'
import createDebugger from 'debug'
import type { AppConfig, AppClientConfig } from '../shared'
import { APP_PATH, ROUTES_REQUEST_PATH, USER_APP_REQUEST_PATH, USER_SITE_REQUEST_PATH, APP_CONFIG_REQUEST_PATH, NOT_FOUND_COMPONENT_PATH, NOT_FOUND_REQUEST_PATH } from '../alias'
import { createServer } from '../server'
import { escapeRegex, serialize, replaceAsync, pascalCase, exists } from './utils'
import { parseId, parseImports } from './parse'
import { unresolvedIslandKey, wrapIslandsInSFC, wrapLayout } from './wrap'
import { extendSite } from './site'

const debug = {
  config: createDebugger('iles:config'),
  mdx: createDebugger('iles:mdx'),
  layout: createDebugger('iles:layout'),
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
const templateLayoutRegex = /<template.*?\slayout=\s*['"](\w+)['"].*?>/

// Public: Configures MDX, Vue, Components, and Islands plugins.
export default function IslandsPlugins (appConfig: AppConfig): PluginOption[] {
  debug.config(appConfig)

  let base: ResolvedConfig['base']
  let mode: ResolvedConfig['mode']
  let root: ResolvedConfig['root']
  let resolveVitePath: ResolveFn

  const appPath = resolve(appConfig.srcDir, 'app.ts')
  const sitePath = resolve(appConfig.srcDir, 'site.ts')
  const layoutsRoot = `/${relative(appConfig.root, appConfig.layoutsDir)}`
  const defaultLayoutPath = `${layoutsRoot}/default.vue`

  const plugins = appConfig.namedPlugins

  function isLayout (path: string) {
    return path.includes(appConfig.layoutsDir)
  }

  function frontmatterFromPage (path: string): Frontmatter | undefined {
    if (plugins.pages.api.pageForFile(path))
      return appConfig.markdown.extendFrontmatter?.({}, path) || {}
  }

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
      async resolveId (id) {
        if (id === ROUTES_REQUEST_PATH)
          return PAGES_REQUEST_PATH

        if (id === APP_CONFIG_REQUEST_PATH || id === USER_APP_REQUEST_PATH || id === USER_SITE_REQUEST_PATH)
          return id

        if (id === NOT_FOUND_REQUEST_PATH) {
          for (const extension of ['vue', 'mdx', 'md', 'jsx']) {
            const path = resolve(appConfig.pagesDir, `404.${extension}`)
            if (await exists(path)) return path
          }
          return NOT_FOUND_COMPONENT_PATH
        }

        // Prevent import analysis failure if the default layout doesn't exist.
        if (id === defaultLayoutPath) return resolve(root, id.slice(1))
      },
      async load (id) {
        if (id === APP_CONFIG_REQUEST_PATH) {
          const { base, debug, jsx, root, ssg: { manualChunks: _, ...ssg }, siteUrl } = appConfig
          const clientConfig: AppClientConfig = { base, debug, root, jsx, ssg, siteUrl }
          return `export default ${serialize(clientConfig)}`
        }

        const userFilename = (id === USER_APP_REQUEST_PATH && appPath)
          || (id === USER_SITE_REQUEST_PATH && sitePath)
        if (userFilename) {
          this.addWatchFile(userFilename)
          const result = await exists(userFilename)
            ? await transformWithEsbuild(await fs.readFile(userFilename, 'utf-8'), userFilename, { sourcemap: false })
            : { code: 'export default {}' }
          return id === USER_SITE_REQUEST_PATH ? extendSite(result.code, appConfig) : result
        }
      },
      handleHotUpdate ({ file, server }) {
        if (file === appPath) return [server.moduleGraph.getModuleById(USER_APP_REQUEST_PATH)!]
        if (file === sitePath) return [server.moduleGraph.getModuleById(USER_SITE_REQUEST_PATH)!]
      },
      configureServer (server) {
        restartOnConfigChanges(appConfig, server)

        const supportedExtensions = ['.html', '.xml', '.json', '.rss', '.atom']

        // serve our index.html after vite history fallback
        return () => {
          server.middlewares.use((req, res, next) => {
            // Fallback when the user has not created a default layout.
            if (req.url?.includes(defaultLayoutPath)) {
              res.statusCode = 200
              res.setHeader('content-type', 'text/javascript')
              res.end('export default false')
            }
            else if (supportedExtensions.some(ext => req.url!.endsWith(ext))) {
              res.statusCode = 200
              res.setHeader('content-type', 'text/html')
              res.end(`
<!DOCTYPE html>
<html>
  <body>
    <div id="app"></div>
    <script type="module" src="/@fs/${APP_PATH}/index.js"></script>
  </body>
</html>`)
            }
          })
        }
      },
    },
    {
      name: 'iles:detect-islands-in-vue',
      enforce: 'pre',
      async transform (code, id) {
        const { path, query } = parseId(id)

        if (query.vue !== undefined && query.type === 'scriptClient')
          return 'export default {}; if (import.meta.hot) import.meta.hot.accept()'

        if (isSFCMain(path, query) && code.includes('client:') && code.includes('<template'))
          return wrapIslandsInSFC(code, path, debug.detect)
      },
    },
    {
      name: 'iles:layouts',
      enforce: 'pre',
      transform (code, id) {
        const { path, query } = parseId(id)
        if (!isSFCMain(path, query) || !isLayout(path)) return
        const layoutName = code.match(templateLayoutRegex)?.[1] || false
        if (String(layoutName) === 'false') return
        return wrapLayout(code, path, debug.layout)
      },
    },

    plugins.vue,
    ...plugins.optionalPlugins,

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

const _sfc_main = defineComponent({
  ${mode === 'development' ? `__file: '${path}',` : ''}
  props: {
    components: { type: Object, default: () => ({}) },
  },
  render () {
    return MDXContent({ ...this.$props, ...this.$attrs })
  },
})
export const render = MDXContent
export default _sfc_main
`)
      },
    },

    plugins.vueJsx,

    // https://github.com/hannoeru/vite-plugin-pages
    plugins.pages,

    // https://github.com/antfu/unplugin-vue-components
    plugins.components,

    {
      name: 'iles:page-hmr',
      apply: 'serve',
      enforce: 'post',
      // Force a refresh for all page computed properties.
      async transform (code, id) {
        const { path } = parseId(id)
        if (isLayout(path) || plugins.pages.api.pageForFile(path)) {
          return `${code}
import.meta.hot.accept('/${relative(root, path)}', (...args) => __ILES_PAGE_UPDATE__(args))
`
        }
      },
    },

    {
      name: 'iles:sfc:page-data',
      enforce: 'post',
      async transform (code, id) {
        const { path, query } = parseId(id)
        const isMarkdownPath = isMarkdown(path)
        if (!isMarkdownPath && !isSFCMain(path, query)) return

        const s = new MagicString(code)
        const sfcIndex = code.indexOf('{', code.indexOf('const _sfc_main = ')) + 1
        const appendToSfc = (key: string, value: string) => s.appendRight(sfcIndex, `${key}:${value},`)

        if (isLayout(path)) {
          appendToSfc('name', `'${pascalCase(basename(path).replace('.vue', 'Layout'))}'`)
          return s.toString()
        }

        const pageMatter = frontmatterFromPage(path)
        if (!pageMatter) return

        if (isMarkdownPath) {
          s.appendRight(sfcIndex, '...meta,...frontmatter,meta,frontmatter,')
        }
        else {
          const { meta, layout, ...frontmatter } = pageMatter
          appendToSfc('meta', serialize(meta))
          appendToSfc('frontmatter', serialize(frontmatter))
        }

        const layoutName = pageMatter.layout ?? 'default'
        appendToSfc('layoutName', serialize(layoutName))
        appendToSfc('layoutFn', String(layoutName) === 'false'
          ? 'false'
          : `() => import('${layoutsRoot}/${layoutName}.vue').then(m => m.default)`)

        return s.toString()
      },
    },

    {
      name: 'iles:client-scripts',
      enforce: 'post',
      async transform (code, id) {
        const { path, query } = parseId(id)

        if (query.clientScript)
          return await transformWithEsbuild(code, path, { loader: query.lang })
      },
    },

    {
      name: 'iles:resolve-islands',
      enforce: 'post',
      async transform (code, id) {
        const { path, query } = parseId(id)
        if (!isMarkdown(path) && !isSFCMain(path, query)) return

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
