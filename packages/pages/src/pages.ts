import type { Plugin } from 'vite'

import type { PagesApi, ResolvedOptions } from './types'

import { createApi } from './api'
import { handleHMR } from './hmr'
import { MODULE_ID } from './types'

export * from './types'

/**
 * An iles module that injects remark plugins to parse pages and expose it
 * to the MDX JS expressions as `meta` and `pages`.
 */
export default function IlesPages (): any {
  let api: PagesApi

  return {
    name: '@islands/pages',
    configResolved (config: any) {
      let {
        base,
        extendFrontmatter,
        extendRoute,
        extendRoutes,
        pagesDir,
        pageExtensions = ['vue', 'md', 'mdx'],
      } = config

      const options: ResolvedOptions = {
        base,
        extendFrontmatter,
        extendRoute,
        extendRoutes,
        pagesDir,
        pageExtensions,
      }

      const pages = PagesPlugin(options)
      config.vitePlugins.push(pages)
      config.namedPlugins.pages = pages
    },
  }

  function PagesPlugin (options: ResolvedOptions): Plugin {
    let generatedRoutes: string | undefined

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
        handleHMR(api, options, () => { generatedRoutes = undefined })
      },
      resolveId (id) {
        if (id === MODULE_ID)
          return MODULE_ID
      },
      async load (id) {
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
