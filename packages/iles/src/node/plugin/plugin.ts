/* eslint-disable no-restricted-syntax */
import { promises as fs } from 'fs'
import { basename, resolve, relative } from 'pathe'
import type { PluginOption, ResolvedConfig, ViteDevServer } from 'vite'
import { transformWithEsbuild } from 'vite'

import MagicString from 'magic-string'

import { shouldTransformRef, transformRef } from 'vue/compiler-sfc'
import type { AppConfig, AppClientConfig } from '../shared'
import { APP_PATH, APP_COMPONENT_PATH, USER_APP_REQUEST_PATH, USER_SITE_REQUEST_PATH, APP_CONFIG_REQUEST_PATH, NOT_FOUND_COMPONENT_PATH, NOT_FOUND_REQUEST_PATH, DEBUG_COMPONENT_PATH } from '../alias'
import { configureMiddleware, ILES_APP_ENTRY } from './middleware'
import { serialize, pascalCase, exists, debug } from './utils'
import { parseId } from './parse'
import { wrapIslandsInSFC, wrapWithLayout } from './wrap'
import { extendSite } from './site'
import { detectMDXComponents } from './markdown'
import { autoImportComposables, writeComposablesDTS } from './composables'
import documents from './documents'

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
  let server: ViteDevServer

  const appPath = resolve(appConfig.srcDir, 'app.ts')
  const sitePath = resolve(appConfig.srcDir, 'site.ts')
  const layoutsRoot = `/${relative(appConfig.root, appConfig.layoutsDir)}`
  const defaultLayoutPath = `${layoutsRoot}/default.vue`

  const plugins = appConfig.namedPlugins

  function isLayout (path: string) {
    return path.includes(appConfig.layoutsDir)
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

        if (id === APP_CONFIG_REQUEST_PATH || id === USER_APP_REQUEST_PATH || id === USER_SITE_REQUEST_PATH)
          return id

        if (id === NOT_FOUND_REQUEST_PATH)
          return NOT_FOUND_COMPONENT_PATH

        // Prevent import analysis failure if the default layout doesn't exist.
        if (id === defaultLayoutPath) return resolve(root, id.slice(1))
      },
      async load (id) {
        if (id === APP_CONFIG_REQUEST_PATH) {
          const { base, debug, jsx, ssg: { sitemap }, siteUrl, markdown: { overrideElements = [] } } = appConfig
          const clientConfig: AppClientConfig = { base, debug, root, jsx, sitemap, siteUrl, overrideElements }
          return `export default ${serialize(clientConfig)}`
        }

        const userFilename = (id === USER_APP_REQUEST_PATH && appPath)
          || (id === USER_SITE_REQUEST_PATH && sitePath)
        if (userFilename) {
          this.addWatchFile(userFilename)
          const result = await exists(userFilename)
            ? await transformWithEsbuild(await fs.readFile(userFilename, 'utf-8'), userFilename, { sourcemap: false })
            : { code: 'export default {}' }

          if (id === USER_APP_REQUEST_PATH)
            detectMDXComponents(result.code, appConfig, server)

          if (id === USER_SITE_REQUEST_PATH)
            return extendSite(result.code, appConfig)

          return result
        }

        if ((isBuild || process.env.VITEST) && id.includes(defaultLayoutPath) && !await exists(resolve(root, defaultLayoutPath.slice(1))))
          return '<template><slot/></template>'
      },
      transform (code, id) {
        if (id === APP_COMPONENT_PATH && !isBuild && appConfig.debug)
          return code.replace('const DebugPanel = () => null', `import DebugPanel from '${DEBUG_COMPONENT_PATH}'`)
      },
      handleHotUpdate ({ file, server }) {
        if (file === appPath) return [server.moduleGraph.getModuleById(USER_APP_REQUEST_PATH)!]
        if (file === sitePath) return [server.moduleGraph.getModuleById(USER_SITE_REQUEST_PATH)!]
      },
      configureServer (devServer) {
        server = devServer
        return configureMiddleware(appConfig, server, defaultLayoutPath)
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
      async transform (code, id) {
        const { path, query } = parseId(id)
        if (!isSFCMain(path, query)) return

        let layoutName: string | false = false

        if (isLayout(path))
          layoutName = code.match(templateLayoutRegex)?.[1] || false

        if (plugins.pages.api.isPage(path))
          layoutName = (await plugins.pages.api.frontmatterForPageOrFile(path, code)).layout ?? 'default'

        if (String(layoutName) !== 'false')
          return wrapWithLayout(code, path, layoutName as string)
      },
    },

    plugins.vue,
    ...appConfig.vitePlugins,
    plugins.components,

    documents(appConfig),

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
      name: 'iles:page-data',
      enforce: 'post',
      async transform (code, id) {
        const { path, query } = parseId(id)
        const isMdx = isMarkdown(path)
        if (!isMdx && !isSFCMain(path, query)) return

        const isLayoutFile = isLayout(path)
        const isPage = plugins.pages.api.isPage(path)
        if (!isMdx && !isLayoutFile && !isPage) return

        const s = new MagicString(code)
        const sfcIndex = code.indexOf('{', code.indexOf('const _sfc_main = ')) + 1
        const appendToSfc = (key: string, value?: string) => s.appendRight(sfcIndex, value ? `${key}:${value},` : `${key},`)

        if (isLayoutFile) {
          appendToSfc('name', `'${pascalCase(basename(path).replace('.vue', 'Layout'))}'`)
          return s.toString()
        }

        appendToSfc('inheritAttrs', serialize(false))

        const { meta, layout = 'default', route: _r, ...frontmatter }
          = await plugins.pages.api.frontmatterForPageOrFile(path, code)

        if (isMdx) {
          // NOTE: Expose each frontmatter property to the MDX file.
          const keys = Object.keys(frontmatter)
          const bindings = Object.entries(frontmatter)
            .map(([key, value]) => `${key} = ${serialize(value)}`)

          bindings.push(`meta = ${serialize(meta)}`)
          bindings.push(`frontmatter = { ${keys.length > 0 ? keys.join(', ') : ''} }`)

          s.prepend(`const ${bindings.join(', ')};`)
          appendToSfc('...meta, ...frontmatter, meta, frontmatter')
        }
        else {
          s.prepend(`const _meta = ${serialize(meta)}, _frontmatter = ${serialize(frontmatter)};`)
          appendToSfc('..._meta, ..._frontmatter, meta: _meta, frontmatter: _frontmatter')
        }

        if (isPage) {
          appendToSfc('layoutName', serialize(layout))
          appendToSfc('layoutFn', !isMdx || String(layout) === 'false'
            ? 'false'
            : `() => import('${layoutsRoot}/${layout}.vue').then(m => m.default)`)
        }

        return s.toString()
      },
    },

    {
      name: 'iles:page-hmr',
      apply: 'serve',
      enforce: 'post',
      // Force a refresh for all page computed properties.
      async transform (code, id) {
        const { path } = parseId(id)
        if (isLayout(path) || plugins.pages.api.isPage(path)) {
          return `${code}
import.meta.hot.accept('/${relative(root, path)}', (...args) => __ILES_PAGE_UPDATE__(args))
`
        }
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
