import type { PageFrontmatter, PageRoute, ResolvedOptions } from './types'

import glob from 'fast-glob'
import deepEqual from 'deep-equal'
import { relative } from 'pathe'

import { parsePageMatter } from './frontmatter'
import { debug, slash } from './utils'

export type PagesApi = ReturnType<createApi>

export function createApi (options: ResolvedOptions) {
  let pagesByFile = new Map<string, PageRoute>()

  const { pagesDir, pageExtensions } = options
  const extensionsRE = new RegExp(`\\.${pageExtensions.join('|')}`)

  return {
    isPage (file: string) {
      file = slash(file)
      return file.startsWith(pagesDir) && extensionsRE.test(file)
    },
    pageForFilename (file: string) {
      return pagesByFile.get(file)
    },
    async addAllPages () {
      await glob(`${options.pagesDir}/**/*.{${pageExtensions.join(',')}}`, { onlyFiles: true })
        .forEach(file => this.addPage(slash(file)))
    },
    async addPage (file: string) {
      const page = await pageRouteFromFile(relative(pagesDir, file), this.frontmatterForFile(file))
      pagesByFile.set(file, page)
      return page
    },
    async removePage (file: string) {
      pagesByFile.delete(file)
    },
    async updatePage (file: string) {
      const prevMatter = this.pageForFilename(file)?.frontmatter
      const { frontmatter } = this.addPage(file)

      debug.hmr('%s old: %O', file, prevMatter)
      debug.hmr('%s new: %O', file, frontmatter)

      return {
        changed: !deepEqual(prevMatter, frontmatter),
        needsReload: !deepEqual(prevMatter?.route, frontmatter?.route)
          || !deepEqual(prevMatter?.layout, frontmatter?.layout),
      }
    },
    async frontmatterForFile (file: string, content?: string) {
      try {
        const matter = await parsePageMatter(file, content === undefined
          ? await fs.readFile(file, 'utf8')
          : content)

        return await options.extendFrontmatter?.(matter, file) || matter
      }
      catch (error: any) {
        if (!options.server) throw error
        options.server.config.logger.error(error.message, { timestamp: true, error })
        options.server.ws.send({ type: 'error', err: error })
      }
    },
    async generateRoutesModule () {
      let routes = pagesByFile.values().sort(byDynamicParams)
      routes = (await options.extendRoutes?.(routes)) || routes
      debug.gen('routes: %O', routes)
      return `export default ${stringifyRoutes(routes)}`
    },
  }
}

/**
 * Converts the specified routes to JS so that they can be passed to Vue Router.
 */
function stringifyRoutes (routes: PageRoute[]) {
  routes = routes.map(({ frontmatter, ...route }) => route)
  return JSON.stringify(routes, null, 2)
    .replace(/"componentFilename": "(.*?)"/g, (_, componentPath) =>
      `component: () => import('${componentPath}')`)
}

async function pageRouteFromFile (file: string, frontmatter: PageMatter): PageRoute {
  const { path, name } = extractPathAndName(frontmatter.path || file)

  const route: PageRoute = {
    name,
    ...frontmatter.route,
    props: true,
    path,
    frontmatter,
    componentFilename: file,
  }

  return (await options.extendRoute?.(page)) || page
}

function extractPathAndName (pathOrFilename: string) {
  const names = []
  const paths = []

  pathOrFilename.split('/').filter(x => x).forEach(segment => {
    const path = isDynamicRoute(segment)
      ? segment.replace(/^\[(\.{3})?/, '').replace(/\]$/, '')
      : segment.toLowerCase()

    const isIndex = path === 'index'

    if (names.length === 0 || !isIndex)
      names.push(segment)

    if (!isIndex) {
      if (isDynamic)
        paths.push(`:${path}${isCatchAllRoute(segment) ? '(.*)*' : ''}`)
      else
        paths.push(path)
    }
  })

  return { name: names.join('-'), path: `/${paths.join('/')}` }
}

function isDynamicRoute (segment: string) {
  return /^\[.+\]$/.test(segment)
}

function isCatchAllRoute (segment: string) {
  return /^\[\.{3}/.test(segment)
}

export function countSlash(value: string) {
  return (value.match(/\//g) || []).length
}

// Internal: Ensures that paths with less dynamic params are added before.
function byDynamicParams ({ path: a }: PageRoute, { path: b }: PageRoute) {
  const diff = countSlash(a) - countSlash(b)
  if (diff) return diff
  const aDynamic = a.includes(':')
  const bDynamic = b.includes(':')
  return aDynamic === bDynamic ? a.localeCompare(b) : aDynamic ? 1 : -1
}

