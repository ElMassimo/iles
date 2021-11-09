/* eslint-disable no-restricted-syntax */
import { promises as fs } from 'fs'
import { basename, resolve, relative } from 'pathe'
import pc from 'picocolors'
import type { PluginOption, ResolvedConfig, ViteDevServer } from 'vite'
import { transformWithEsbuild } from 'vite'

import { MODULE_ID_VIRTUAL as PAGES_REQUEST_PATH } from 'vite-plugin-pages'
import MagicString from 'magic-string'

import type { Frontmatter } from '@islands/frontmatter'
import { shouldTransformRef, transformRef } from 'vue/compiler-sfc'
import type { AppConfig, AppClientConfig } from '../shared'
import { APP_PATH, ROUTES_REQUEST_PATH, USER_APP_REQUEST_PATH, USER_SITE_REQUEST_PATH, APP_CONFIG_REQUEST_PATH, NOT_FOUND_COMPONENT_PATH, NOT_FOUND_REQUEST_PATH } from '../alias'
import { createServer } from '../server'
import { serialize, pascalCase, exists, debug } from './utils'
import { parseId } from './parse'
import { wrapIslandsInSFC, wrapLayout } from './wrap'
import { extendSite } from './site'
import { autoImportComposables, writeComposablesDTS } from './composables'
import { hmrRuntime } from './hmr'

export const ILES_APP_ENTRY = '/@iles-entry'

function isMarkdown (path: string) {
  return path.endsWith('.mdx') || path.endsWith('.md')
}

function isSFCMain (path: string, query: Record<string, any>) {
  return path.endsWith('.vue') && query.vue === undefined
}

const templateLayoutRegex = /<template.*?\slayout=\s*['"](\w+)['"].*?>/

// Public: Configures MDX, Vue, Components, and Islands plugins.
export default function IslandsPlugins (appConfig: AppConfig): PluginOption[] {
  debug.config(appConfig)

  let base: ResolvedConfig['base']
  let root: ResolvedConfig['root']
  let isBuild: boolean

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
        root = config.root
        isBuild = config.command === 'build'
        appConfig.resolvePath = config.createResolver()

        writeComposablesDTS(root)
      },
      async resolveId (id) {
        if (id === ILES_APP_ENTRY)
          return APP_PATH

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

        if (isBuild && id.includes(defaultLayoutPath) && !await exists(resolve(root, defaultLayoutPath.slice(1))))
          return '<template><slot/></template>'
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
          server.middlewares.use(async (req, res, next) => {
            const url = req.url || ''
            // Fallback when the user has not created a default layout.
            if (url.includes(defaultLayoutPath)) {
              res.statusCode = 200
              res.setHeader('content-type', 'text/javascript')
              res.end('export default false')
            }
            else if (supportedExtensions.some(ext => url.endsWith(ext))) {
              res.statusCode = 200
              res.setHeader('content-type', 'text/html')

              let html = `
<!DOCTYPE html>
<html>
  <body>
    <div id="app"></div>
    <script type="module" src="${ILES_APP_ENTRY}"></script>
  </body>
</html>`
              html = await server.transformIndexHtml(url, html, req.originalUrl)
              res.end(html)
            }
            else {
              next()
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
          return wrapIslandsInSFC(appConfig, code, path)
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
        return wrapLayout(code, path)
      },
    },

    plugins.markdown,
    plugins.vue,
    ...plugins.optionalPlugins,

    // https://github.com/hannoeru/vite-plugin-pages
    plugins.pages,

    // https://github.com/antfu/unplugin-vue-components
    plugins.components,

    {
      name: 'iles:mdx:hmr',
      apply: 'serve',
      async transform (code, id) {
        const { path } = parseId(id)
        if (isMarkdown(path) && code.includes('_sfc_main = '))
          return `${code.replace('defineComponent({', m => `${m}__file: '${path}',`)}\n${hmrRuntime(id)}`
      },
    },

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
      name: 'iles:composables',
      enforce: 'post',
      async transform (code, id) {
        if (!id.startsWith(appConfig.srcDir)) return

        const { path, query } = parseId(id)
        if (isSFCMain(path, query) || /\.[tj]sx?/.test(path))
          return await autoImportComposables(code, id)
      },
    },

    {
      name: 'iles:sfc:page-data',
      enforce: 'post',
      async transform (code, id) {
        const { path, query } = parseId(id)
        const isMarkdownPath = isMarkdown(path)
        const isSFC = isSFCMain(path, query)
        if (!isMarkdownPath && !isSFC) return

        const s = new MagicString(code)
        const sfcIndex = code.indexOf('{', code.indexOf('const _sfc_main = ')) + 1
        const appendToSfc = (key: string, value: string) => s.appendRight(sfcIndex, `${key}:${value},`)

        if (isLayout(path)) {
          appendToSfc('name', `'${pascalCase(basename(path).replace('.vue', 'Layout'))}'`)
          return s.toString()
        }

        const pageMatter = frontmatterFromPage(path)

        if (isMarkdownPath) {
          appendToSfc('inheritAttrs', serialize(false))
          s.appendRight(sfcIndex, '...meta,...frontmatter,meta,frontmatter,')
        }

        if (pageMatter) {
          if (isSFC) {
            const { meta, layout, ...frontmatter } = pageMatter
            appendToSfc('inheritAttrs', serialize(false))
            appendToSfc('meta', serialize(meta))
            appendToSfc('frontmatter', serialize(frontmatter))
          }
          const layoutName = pageMatter.layout ?? 'default'
          appendToSfc('layoutName', serialize(layoutName))
          appendToSfc('layoutFn', String(layoutName) === 'false'
            ? 'false'
            : `() => import('${layoutsRoot}/${layoutName}.vue').then(m => m.default)`)
        }

        return s.toString()
      },
    },

    typeof shouldTransformRef === 'function' && {
      name: 'iles:client-scripts',
      enforce: 'post',
      async transform (code, id) {
        const { path: filename, query } = parseId(id)
        if (query.clientScript && shouldTransformRef(code))
          return transformRef(code, { filename, sourceMap: true })
      },
    },

    appConfig.jsx === 'preact' && {
      name: 'iles:preact-jsx-config',
      config () {
        return { esbuild: { include: /\.(tsx?|jsx)$/ } }
      },
    },
  ]
}

async function restartOnConfigChanges (config: AppConfig, server: ViteDevServer) {
  const restartIfConfigChanged = async (path: string) => {
    if (path === config.configPath) {
      server.config.logger.info(
        pc.green(
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
