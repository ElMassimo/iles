import type { PageFrontmatter, PageRoute, PagesOptions, ResolvedOptions, PagesByFile } from './types'

import glob from 'fast-glob'

import { debug, slash } from './utils'

export function createApi (options: ResolvedOptions) {
  let pagesByFile: PagesByFile = new Map<string, PageRoute>()

  return {
    async addAllPages () {
      await glob(`${options.pagesDir}/**/*.{${pageExtensions.join(',')}}`, { onlyFiles: true })
        .forEach(file => this.addPage(slash(file)))
    },
    async addPage (file: string) {
      pagesByFile.set(file, await this.pageRouteFromFile(file, options))
    },
    async updatePage (file: string) {
      pagesByFile.set(file, await this.pageRouteFromFile(file, options))
    },
    async generateRoutesModule () {
      let routes = pagesByFile.values().sort(byDynamicParams)
      routes = (await options.extendRoutes?.(routes)) || routes
      debug.gen('routes: %O', routes)
      return `export default ${stringifyRoutes(routes)}`
    },
    async frontmatterForFile (path: string, content?: string) {
      try {
        path = slash(path)

        const matter = force
          ? await parsePageMatter(path)
          : frontmatterByFile.get(path) || await parsePageMatter(path)

        frontmatterByFile.set(path, matter)

        return matter
      }
      catch (error: any) {
        if (!server) throw error
        server.config.logger.error(error.message, { timestamp: true, error })
        server.ws.send({ type: 'error', err: error })
      }
    },
    async pageRouteFromFile (file: string, options: ResolvedOptions) {
      const pathNodes = slash(file).split('/')
      for (let i = 0; i < pathNodes.length; i++) {
        const node = pathNodes[i]
        const isDynamic = isDynamicRoute(node)
        const isCatchAll = isCatchAllRoute(node)
        const normalizedName = isDynamic
          ? node.replace(/^\[(\.{3})?/, '').replace(/\]$/, '').toLowerCase()
          : node.toLowerCase()
        const normalizedPath = normalizedName.toLowerCase()

        if (!route.name || route.name !== 'index')
          route.name += route.name ? `-${normalizedName}` : normalizedName

        // Check nested route
        cons Routes.find(node => node.name === route.name)

        if (normalizedName.toLowerCase() === 'index' && !route.path) {
          route.path += '/'
        }
        else if (normalizedName.toLowerCase() !== 'index') {
          if (isDynamic) {
            route.path += `/:${normalizedName}`
            // Catch-all route
            if (isCatchAll)
              route.path += '(.*)*'
          }
          else {
            route.path += `/${normalizedPath}`
          }
        }
      }
      if (route.name)
        route.name = route.name.replace(/-index$/, '')

      route.props = true
      Object.assign(route, route.customBlock?.route || {})

      delete route.customBlock

      Object.assign(route, options.extendRoute?.(route) || {})
    },
  }
}

function isDynamicRoute (routePath: string) {
  return /^\[.+\]$/.test(routePath)
}

function isCatchAllRoute (routePath: string) {
  return /^\[\.{3}/.test(routePath)
}

// Internal: Ensures that paths with less dynamic params are added before.
function byDynamicParams ({ path: a }: PageRoute, { path: b }: PageRoute) {
  if (a.includes(':') && b.includes(':'))
    return b > a ? 1 : -1
  else if (a.includes(':') || b.includes(':'))
    return a.includes(':') ? 1 : -1
  else
    return b > a ? 1 : -1
}

/**
 * Converts the specified routes to JS so that they can be passed to Vue Router.
 */
function stringifyRoutes (routes: PageRoute[]) {
  return JSON.stringify(routes, null, 2)
    .replace(/"component": "(.*?)"/g, (_, componentPath) =>
      `component: () => import('${componentPath}')`)
}

export type PagesApi = ReturnType<createApi>
