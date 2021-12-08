import type { Plugin } from 'vite'

import type { PagesApi, PagesOptions, ResolvedOptions } from './types'

/**
 * An iles module that injects remark plugins to parse pages and expose it
 * to the MDX JS expressions as `meta` and `pages`.
 */
export default function IlesPages (): any {
  let api: PagesApi

  return {
    name: '@islands/pages',
    configResolved (config: any) {
      let { extendRoute, extendRoutes, pagesDir, pageExtensions = ['vue', 'md', 'mdx'] } = config

      const options: ResolvedOptions = { extendRoute, extendRoutes, pagesDir, pageExtensions }

      config.vitePlugins.push(PagesPlugin(options))
    },
    extendFrontmatter (frontmatter, filename) {
      const page = api.pageForFilename(filename)
      if (frontmatter.path || page)
        frontmatter.meta.href = frontmatter.path || page.path
    },
  }

  function PagesPlugin (options: PagesOptions): Plugin {
    let generatedRoutes: string

    return {
      name: 'iles:pages',
      enforce: 'pre',
      get api () {
        return api
      },
      async configResolved (config) {
        api = createApi(options)
        await api.addAllPages()
      },
      configureServer (server) {
        options.server = server
        handleHMR(api, options, () => { generatedRoutes = null })
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
        if (id.includes('vue&type=page'))
          return 'export default {};'
      },
    }
  }
}
