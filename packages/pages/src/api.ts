import { promises as fs } from 'fs'
import glob from 'fast-glob'
import deepEqual from 'deep-equal'
import { relative, resolve } from 'pathe'
import type { RawPageMatter, PageRoute, ResolvedOptions, UserRoute } from './types'

import { parsePageMatter } from './frontmatter'
import { debug, slash } from './utils'

export function createApi (options: ResolvedOptions) {
  let pagesByFile = new Map<string, PageRoute>()

  const { root, pagesDir, pageExtensions } = options
  const extensionsRE = new RegExp(`\\.${pageExtensions.join('|')}`)

  return {
    isPage (file: string) {
      file = slash(file)
      return file.startsWith(pagesDir) && extensionsRE.test(file)
    },
    pageForFilename (file: string) {
      return pagesByFile.get(resolve(root, file))
    },
    async addAllPages () {
      const files = await glob(`${options.pagesDir}/**/*.{${pageExtensions.join(',')}}`, { onlyFiles: true })
      await Promise.all(files.map(async file => await this.addPage(slash(file))))
    },
    async addPage (file: string) {
      const page = await this.pageRouteFromFile(file)
      pagesByFile.set(file, page)
      return page
    },
    async removePage (file: string) {
      pagesByFile.delete(file)
    },
    async updatePage (file: string) {
      const prevMatter = this.pageForFilename(file)?.frontmatter
      const { frontmatter } = await this.addPage(file)

      debug.hmr('%s old: %O', file, prevMatter)
      debug.hmr('%s new: %O', file, frontmatter)

      return {
        changed: !deepEqual(prevMatter, frontmatter),
        needsReload: !deepEqual(prevMatter?.route, frontmatter?.route),
      }
    },
    async pageRouteFromFile (file: string) {
      const frontmatter = await this.frontmatterForFile(file)
      const filePath = relative(pagesDir, file)
      const extIndex = filePath.lastIndexOf('.')
      const { path, name } = extractPathAndName(frontmatter.route.path || filePath.slice(0, extIndex))

      let route: PageRoute = {
        name,
        ...frontmatter.route,
        path,
        frontmatter,
        componentFilename: file,
      }

      route = await options.extendRoute?.(route) || route
      route.frontmatter.meta.href = `${options.base}${route.path.slice(1)}`

      return route
    },
    async generateRoutesModule () {
      const routes = Array.from(pagesByFile.values()).sort(byDynamicParams)
      const userRoutes = await options.extendRoutes?.(routes) || routes
      debug.gen('routes: %O', userRoutes)
      return `export default ${stringifyRoutes(userRoutes)}`
    },
    async frontmatterForFile (file: string, content?: string): Promise<RawPageMatter> {
      try {
        if (content === undefined) content = await fs.readFile(resolve(root, file), 'utf8')
        file = relative(root, file)

        const matter = await parsePageMatter(file, content)

        return await options.extendFrontmatter?.(matter, file) || matter
      }
      catch (error: any) {
        if (!options.server) throw error
        options.server.config.logger.error(error.message, { timestamp: true, error })
        options.server.ws.send({ type: 'error', err: error })
        return { frontmatter: {}, meta: {} as any, route: {}, layout: false }
      }
    },
  }
}

/**
 * Converts the specified routes to JS so that they can be passed to Vue Router.
 */
function stringifyRoutes (routes: UserRoute[]) {
  return JSON.stringify(routes.map(toVueRouter))
    .replace(/"componentFilename":"(.*?)"/g, (_, componentPath) =>
      `component: () => import('${componentPath}')`)
}

function toVueRouter ({ frontmatter, templateAttrs, ...route }: UserRoute & { templateAttrs?: Record<string, any> }) {
  return { props: true, ...route }
}

function extractPathAndName (pathOrFilename: string) {
  const names: string[] = []
  const paths: string[] = []

  pathOrFilename.split('/').filter(x => x).forEach((segment) => {
    const isDynamic = isDynamicRoute(segment)

    const path = isDynamic
      ? segment.replace(/^\[(\.{3})?/, '').replace(/\]$/, '')
      : segment.toLowerCase()

    const isIndex = path === 'index'

    if (names.length === 0 || !isIndex)
      names.push(path)

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

export function countSlash (value: string) {
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
