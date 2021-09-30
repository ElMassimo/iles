import { extname } from 'path'
import type { AppConfig, CreateAppFactory, RouteRecordRaw, SSGRoute } from '../shared'
import { pathToFilename } from './utils'

export async function getRoutesForSSG (config: AppConfig, createApp: CreateAppFactory) {
  const routesForSSG: Map<string, SSGRoute> = new Map()

  const addPaths = (routes: RouteRecordRaw[], prefix = '') => {
    for (const route of routes) {
      let path = route.path
      if (route.path) {
        // Check for leading slash
        path = prefix && !route.path.startsWith('/')
          ? `${prefix}/${route.path}`
          : route.path

        const { meta } = route
        const { filename } = meta!
        const extension = extname(path).slice(1) || '.html'

        routesForSSG.set(path, {
          path,
          filename,
          extension,
          outputFilename: pathToFilename(path, extension),
        })
      }
      if (Array.isArray(route.children))
        addPaths(route.children, path.replace(/\/$/g, '')) // Remove trailing slash
    }
  }

  addPaths((await createApp()).routes)
  return Array.from(routesForSSG.values())
}
