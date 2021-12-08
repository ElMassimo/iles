import { resolve, basename } from 'pathe'
import Debug from 'debug'
import deepEqual from 'deep-equal'
import type { Nullable, Arrayable } from '@antfu/utils'
import type { ViteDevServer } from 'vite'
import type { OutputBundle } from 'rollup'
import { ResolvedOptions, Route } from './types'
import { parseRouteData } from './parser'
import { MODULE_ID_VIRTUAL } from './constants'

export const debug = {
  hmr: Debug('iles:pages:hmr'),
  parser: Debug('iles:pages:parser'),
  gen: Debug('iles:pages:gen'),
  options: Debug('iles:pages:options'),
  cache: Debug('iles:pages:cache'),
  pages: Debug('iles:pages:pages'),
}

export function resolveImportMode (
  filepath: string,
  options: ResolvedOptions,
) {
  const mode = options.importMode
  if (typeof mode === 'function')
    return mode(filepath)

  for (const pageDir of options.pagesDir) {
    if (
      options.syncIndex
      && pageDir.baseRoute === ''
      && filepath === `/${pageDir.dir}/index.vue`
    )
      return 'sync'
  }
  return mode
}

export function findRouteByFilename (routes: Route[], filename: string): Route | null {
  let result = null
  for (const route of routes) {
    if (filename.endsWith(route.component))
      result = route

    if (!result && route.children)
      result = findRouteByFilename(route.children, filename)

    if (result) return result
  }
  return null
}

export async function getRouteBlock (path: string, options: ResolvedOptions) {
  if (!isTarget(path, options) || options.react) return null

  let result
  try {
    result = await parseRouteData(path, options)
  }
  catch (error: any) {
    if (!options.server) throw error
    options.server.config.logger.error(error.message, { timestamp: true, error })
    options.server.ws.send({ type: 'error', err: error })
  }
  if (!result) return null

  debug.parser('%s: %O', path, result)
  routeBlockCache.set(slash(path), result)

  return result
}

export async function checkRouteBlockChanges (filePath: string, options: ResolvedOptions) {
  debug.cache(routeBlockCache)
  const oldRouteBlock = routeBlockCache.get(filePath)
  const routeBlock = await getRouteBlock(filePath, options)

  debug.hmr('%s old: %O', filePath, oldRouteBlock)
  debug.hmr('%s new: %O', filePath, routeBlock)

  return {
    changed: !deepEqual(oldRouteBlock, routeBlock),
    needsReload: !deepEqual(oldRouteBlock?.route, routeBlock?.route)
      || !deepEqual(oldRouteBlock?.templateAttrs, routeBlock?.templateAttrs),
  }
}
