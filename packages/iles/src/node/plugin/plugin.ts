import { promises as fs } from 'node:fs'
import { basename, relative, resolve } from 'pathe'
import type { PluginOption, ResolvedConfig, ViteDevServer } from 'vite'
import { transformWithEsbuild } from 'vite'

import MagicString from 'magic-string'

import type { AppClientConfig, AppConfig } from '../shared'
import { ILES_APP_ENTRY } from '../constants'
import { APP_COMPONENT_PATH, APP_CONFIG_REQUEST_PATH, APP_PATH, DEBUG_COMPONENT_PATH, NOT_FOUND_COMPONENT_PATH, NOT_FOUND_REQUEST_PATH, USER_APP_REQUEST_PATH, USER_SITE_REQUEST_PATH } from '../alias'
import { configureMiddleware } from './middleware'
import { debug, exists, pascalCase, serialize } from './utils'
import { parseId } from './parse'
import { wrapIslandsInSFC, wrapLayout } from './wrap'
import { extendSite } from './site'
import { detectMDXComponents } from './markdown'
import { autoImportComposables, writeComposablesDTS } from './composables'
import documents from './documents'

function isMarkdown(path: string) {
  return path.endsWith('.mdx') || path.endsWith('.md')
}

function isSFCMain(path: string, query: Record<string, any>) {
  return path.endsWith('.vue') && query.vue === undefined
}

function isVueScript(path: string, query: Record<string, any>) {
  return path.endsWith('.vue') && (!query.type || query.type === 'script')
}

async function transformUserFile(path: string) {
  return await exists(path)
    ? await transformWithEsbuild(await fs.readFile(path, 'utf-8'), path, { sourcemap: false })
    : { code: 'export default {}' }
}

const templateLayoutRegex = /<template.*?\slayout=\s*['"](\w+)['"].*?>/

// Public: Configures MDX, Vue, Components, and Islands plugins.
export default function IslandsPlugins(appConfig: AppConfig): PluginOption[] {
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

  function isLayout(path: string) {
    return path.includes(appConfig.layoutsDir)
  }

  return [
    {
      name: 'iles',
      enforce: 'pre',
      async configResolved(config) {
        if (base) { return }
        base = config.base
        root = config.root
        isBuild = config.command === 'build'
        appConfig.resolvePath = config.createResolver()

        writeComposablesDTS(root)

        // Detect mdxComponents in app.ts to ensure MDX files are compiled accordingly.
        const result = await transformUserFile(appPath)
        detectMDXComponents(result.code, appConfig, undefined)
      },
      async resolveId(id) {
        if (id === ILES_APP_ENTRY) { return APP_PATH }

        if (id === APP_CONFIG_REQUEST_PATH || id === USER_APP_REQUEST_PATH || id === USER_SITE_REQUEST_PATH) { return id }

        if (id === NOT_FOUND_REQUEST_PATH) { return NOT_FOUND_COMPONENT_PATH }

        // Prevent import analysis failure if the default layout doesn't exist.
        if (id === defaultLayoutPath) { return resolve(root, id.slice(1)) }
      },
      async load(id) {
        if (id === APP_CONFIG_REQUEST_PATH) {
          const { base, debug, jsx, ssg: { sitemap }, siteUrl, markdown: { overrideElements = [] } } = appConfig
          const clientConfig: AppClientConfig = { base, debug, root, jsx, sitemap, siteUrl, overrideElements }
          return `export default ${serialize(clientConfig)}`
        }

        const userFilename = (id === USER_APP_REQUEST_PATH && appPath)
          || (id === USER_SITE_REQUEST_PATH && sitePath)
        if (userFilename) {
          this.addWatchFile(userFilename)
          const result = await transformUserFile(userFilename)

          if (id === USER_APP_REQUEST_PATH) { detectMDXComponents(result.code, appConfig, server) }

          if (id === USER_SITE_REQUEST_PATH) { return extendSite(result.code, appConfig) }

          return result
        }

        if ((isBuild || process.env.VITEST) && id.includes(defaultLayoutPath) && !await exists(resolve(root, defaultLayoutPath.slice(1)))) { return '<template><slot/></template>' }
      },
      transform(code, id) {
        if (id === APP_COMPONENT_PATH && !isBuild && appConfig.debug) { return code.replace('const DebugPanel = () => null', () => `import DebugPanel from '${DEBUG_COMPONENT_PATH}'`) }
      },
      handleHotUpdate({ file, server }) {
        if (file === appPath) { return [server.moduleGraph.getModuleById(USER_APP_REQUEST_PATH)!] }
        if (file === sitePath) { return [server.moduleGraph.getModuleById(USER_SITE_REQUEST_PATH)!] }
      },
      configureServer(devServer) {
        server = devServer
        return configureMiddleware(appConfig, server, defaultLayoutPath)
      },
    },
    {
      name: 'iles:detect-islands-in-vue',
      enforce: 'pre',
      async transform(code, id) {
        const { path, query } = parseId(id)

        if (query.vue !== undefined && query.type === 'scriptClient') { return 'export default {}; if (import.meta.hot) import.meta.hot.accept()' }

        if (isSFCMain(path, query) && code.includes('client:') && code.includes('<template')) { return wrapIslandsInSFC(appConfig, code, path) }
      },
    },
    {
      name: 'iles:layouts',
      enforce: 'pre',
      transform(code, id) {
        const { path, query } = parseId(id)
        if (!isSFCMain(path, query) || !isLayout(path)) { return }
        const layoutName = code.match(templateLayoutRegex)?.[1] || false
        if (String(layoutName) === 'false') { return }
        return wrapLayout(code, path)
      },
    },

    plugins.vue,
    ...appConfig.vitePlugins,
    plugins.components,

    documents(appConfig),

    {
      name: 'iles:composables',
      enforce: 'post',
      async transform(code, id) {
        if (!id.startsWith(appConfig.srcDir)) { return }

        const { path, query } = parseId(id)
        if (isVueScript(path, query) || /\.[tj]sx?/.test(path)) { return await autoImportComposables(code, id) }
      },
    },

    {
      name: 'iles:page-data',
      enforce: 'post',
      async transform(code, id, options) {
        const { path, query } = parseId(id)
        const isMdx = isMarkdown(path)
        if (!isMdx && !isVueScript(path, query)) { return }

        const isLayoutFile = isLayout(path)
        const isPage = plugins.pages.api.isPage(path)
        if (!isMdx && !isLayoutFile && !isPage) { return }

        const sfcIndex = indexOfVueComponentDefinition(code)
        if (!sfcIndex || sfcIndex === -1) { return }

        const s = new MagicString(code)
        const appendToSfc = (key: string, value?: string) =>
          s.appendRight(sfcIndex, value ? `${key}:${value},` : `${key},`)

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
          appendToSfc('layoutFn', String(layout) === 'false'
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
      async transform(code, id) {
        const { path } = parseId(id)
        if (isLayout(path) || plugins.pages.api.isPage(path)) {
          return `${code}
import.meta.hot.accept('/${relative(root, path)}', (...args) => __ILES_PAGE_UPDATE__(args))
`
        }
      },
    },

    appConfig.jsx === 'preact' && {
      name: 'iles:preact-jsx-config',
      config() {
        return { esbuild: { include: /\.(tsx?|jsx)$/ } }
      },
    },
  ]
}

// Internal: Inspect the code definition for a Vue SFC to locate the place where
// the SFC is defined, in order to inject additional data.
function indexOfVueComponentDefinition(code: string) {
  let sfcConstIndex = code.indexOf('const _sfc_main = ')

  if (sfcConstIndex === -1) { sfcConstIndex = code.indexOf('export default ') }

  if (sfcConstIndex === -1) { return } // The main component definition lives in a different file.

  const braceIndex = code.indexOf('{', sfcConstIndex)
  if (braceIndex === -1) { return } // The main component definition lives in a different file.

  return braceIndex + 1
}
