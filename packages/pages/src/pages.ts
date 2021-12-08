import type { Plugin } from 'vite'

import type { PageFrontmatter, PageRoute, PagesOptions, ResolvedOptions, PagesByFile } from './types'
import { generateRoutesModule } from './generate'
import { addAllPages } from './pageRoutes'

/**
 * An iles module that injects remark plugins to parse pages and expose it
 * to the MDX JS expressions as `meta` and `pages`.
 */
export default function IlesPages (): any {
  let options: ResolvedOptions
  let generatedRoutes: string

  let api: PagesApi
  let server: ViteDevServer

  return {
    name: '@islands/pages',
    configResolved (config: any) {
      config.vitePlugins.push(PagesPlugin(config))
      frontmatterApi = config.namedPlugins.frontmatter.api
    },
    extendFrontmatter (frontmatter, filename) {
      const page = pagesByFile.get(filename)
      if (page) frontmatter.meta.href = frontmatter.path || page.path
    },
  }

  function PagesPlugin (userOptions: PagesOptions): Plugin {
    return {
      name: 'iles:pages',
      enforce: 'pre',
      get api () {
        return api
      },
      async configResolved (config) {
        options = resolveOptions(pagesByFile, userOptions)
        const api = createApi(pagesByFile, options)
        await api.addAllPages()
      },
      configureServer (server) {
        handleHMR(pages, options, () => { generatedRoutes = null })
      },
      resolveId(id) {
        if (id === MODULE_ID)
          return MODULE_ID
      },
      async load(id) {
        if (id === MODULE_ID)
          return generatedRoutes ||= await api.generateRoutesModule()
      },
      async transform (_code, id) {
        if (!/vue&type=page/.test(id))
          return 'export default {};'
      },
    }
  }
}

function resolveOptions (pagesByFile: PagesByFile, userOptions: PagesOptions): ResolvedOptions {
  let {
    extendRoute,
    extendRoutes,
    pagesDir,
    pageExtensions = ['vue', 'md', 'mdx'],
  } = userOptions

  pagesDir = slash(options.pagesDir)

  const extensionsRE = new RegExp(`\.${pageExtensions.join('|')}`)

  function isPage (path: string) {
    path = slash(path)
    return path.startsWith(pagesDir) && extensionsRE.test(path)
  }

  function frontmatterForFile (path: string): PageMatter | undefined {
    const page = plugins.pages.api.pageForFile(path)
    if (page) {
      const ext = extname(page.customBlock.route?.path)
      const isHtml = !ext || ext === '.html'
      return {
        layout: isHtml ? 'default' : false,
        ...appConfig.markdown.extendFrontmatter?.({}, path),
      }
    }
  }

  return { extendRoute, extendRoutes, frontmatterForFile, isPage, pagesDir, pageExtensions }
}
