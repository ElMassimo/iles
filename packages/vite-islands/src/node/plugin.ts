import path from 'path'
import { defineConfig, mergeConfig, Plugin, ResolvedConfig } from 'vite'
import { SiteConfig, resolveSiteData } from './config'
import {
  createMarkdownToVueRenderFn,
  MarkdownCompileResult
} from './markdownToVue'
import { APP_PATH, SITE_DATA_REQUEST_PATH } from './alias'
import createVuePlugin from '@vitejs/plugin-vue'
import { slash } from './utils/slash'
import { OutputAsset, OutputChunk } from 'rollup'

const hashRE = /\.(\w+)\.js$/
const staticInjectMarkerRE =
  /\b(const _hoisted_\d+ = \/\*#__PURE__\*\/createStaticVNode)\("(.*)", (\d+)\)/g
const staticStripRE = /__VP_STATIC_START__.*?__VP_STATIC_END__/g
const staticRestoreRE = /__VP_STATIC_(START|END)__/g

const isPageChunk = (
  chunk: OutputAsset | OutputChunk
): chunk is OutputChunk & { facadeModuleId: string } =>
  !!(
    chunk.type === 'chunk' &&
    chunk.isEntry &&
    chunk.facadeModuleId &&
    chunk.facadeModuleId.endsWith('.md')
  )

export function createVitePressPlugin(
  root: string,
  {
    srcDir,
    configPath,
    alias,
    markdown,
    site,
    vue: userVuePluginOptions,
    vite: userViteConfig,
    pages
  }: SiteConfig,
  ssr = false,
  pageToHashMap?: Record<string, string>
): Plugin[] {
  let markdownToVue: (
    src: string,
    file: string,
    publicDir: string
  ) => MarkdownCompileResult

  const vuePlugin = createVuePlugin({
    include: [/\.vue$/, /\.md$/],
    ...userVuePluginOptions
  })

  let siteData = site
  let hasDeadLinks = false
  let config: ResolvedConfig

  const vitePressPlugin: Plugin = {
    name: 'vitepress',

    configResolved(resolvedConfig) {
      config = resolvedConfig
      markdownToVue = createMarkdownToVueRenderFn(
        srcDir,
        markdown,
        pages,
        config.define,
        config.command === 'build'
      )
    },

    config() {
      const baseConfig = defineConfig({
        resolve: {
          alias
        },
        define: {
          __CARBON__: !!site.themeConfig.carbonAds?.carbon,
          __BSA__: !!site.themeConfig.carbonAds?.custom,
          __ALGOLIA__: !!site.themeConfig.algolia
        },
        optimizeDeps: {
          // force include vue to avoid duplicated copies when linked + optimized
          include: ['vue'],
          exclude: ['@docsearch/js']
        },
        server: {
          fs: {
            allow: [APP_PATH, srcDir]
          }
        }
      })
      return userViteConfig
        ? mergeConfig(userViteConfig, baseConfig)
        : baseConfig
    },

    resolveId(id) {
      if (id === SITE_DATA_REQUEST_PATH) {
        return SITE_DATA_REQUEST_PATH
      }
    },

    load(id) {
      if (id === SITE_DATA_REQUEST_PATH) {
        return `export default ${JSON.stringify(JSON.stringify(siteData))}`
      }
    },

    transform(code, id) {
      if (id.endsWith('.md')) {
        // transform .md files into vueSrc so plugin-vue can handle it
        const { vueSrc, deadLinks, includes } = markdownToVue(
          code,
          id,
          config.publicDir
        )
        if (deadLinks.length) {
          hasDeadLinks = true
        }
        if (includes.length) {
          includes.forEach((i) => {
            this.addWatchFile(i)
          })
        }
        return vueSrc
      }
    },

    renderStart() {
      if (hasDeadLinks) {
        throw new Error(`One or more pages contain dead links.`)
      }
    },

    configureServer(server) {
      server.watcher.add(configPath)

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

    renderChunk(code, chunk) {
      if (!ssr && isPageChunk(chunk as OutputChunk)) {
        // For each page chunk, inject marker for start/end of static strings.
        // we do this here because in generateBundle the chunks would have been
        // minified and we won't be able to safely locate the strings.
        // Using a regexp relies on specific output from Vue compiler core,
        // which is a reasonable trade-off considering the massive perf win over
        // a full AST parse.
        code = code.replace(
          staticInjectMarkerRE,
          '$1("__VP_STATIC_START__$2__VP_STATIC_END__", $3)'
        )
        return code
      }
      return null
    },

    generateBundle(_options, bundle) {
      if (ssr) {
        // ssr build:
        // delete all asset chunks
        for (const name in bundle) {
          if (bundle[name].type === 'asset') {
            delete bundle[name]
          }
        }
      } else {
        // client build:
        // for each .md entry chunk, adjust its name to its correct path.
        for (const name in bundle) {
          const chunk = bundle[name]
          if (isPageChunk(chunk)) {
            // record page -> hash relations
            const hash = chunk.fileName.match(hashRE)![1]
            pageToHashMap![chunk.name.toLowerCase()] = hash

            // inject another chunk with the content stripped
            bundle[name + '-lean'] = {
              ...chunk,
              fileName: chunk.fileName.replace(/\.js$/, '.lean.js'),
              code: chunk.code.replace(staticStripRE, ``)
            }
            // remove static markers from original code
            chunk.code = chunk.code.replace(staticRestoreRE, '')
          }
        }
      }
    },

    async handleHotUpdate(ctx) {
      // handle config hmr
      const { file, read, server } = ctx
      if (file === configPath) {
        const newData = await resolveSiteData(root)
        if (newData.base !== siteData.base) {
          console.warn(
            `[vitepress]: config.base has changed. Please restart the dev server.`
          )
        }
        siteData = newData
        return [server.moduleGraph.getModuleById(SITE_DATA_REQUEST_PATH)!]
      }

      // hot reload .md files as .vue files
      if (file.endsWith('.md')) {
        const content = await read()
        const { pageData, vueSrc } = markdownToVue(
          content,
          file,
          config.publicDir
        )

        // notify the client to update page data
        server.ws.send({
          type: 'custom',
          event: 'vitepress:pageData',
          data: {
            path: `/${slash(path.relative(srcDir, file))}`,
            pageData
          }
        })

        // reload the content component
        return vuePlugin.handleHotUpdate!({
          ...ctx,
          read: () => vueSrc
        })
      }
    }
  }

  return [vitePressPlugin, vuePlugin]
}
