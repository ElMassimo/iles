import { PageComponent } from 'iles'
import { extname } from 'pathe'
import type { AppConfig, CreateAppFactory, Router, RouteRecordRaw, SSGRoute } from '../shared'
import { pathToFilename } from './utils'

export async function getRoutesForSSG (config: AppConfig, createApp: CreateAppFactory) {
  const routesForSSG: Map<string, SSGRoute> = new Map()

  const addPaths = async (router: Router, routes: RouteRecordRaw[], prefix = '') => {
    for (const route of routes) {
      let path = route.path

      if (path) {
        // Check for leading slash
        path = prefix && !path.startsWith('/') ? `${prefix}/${path}` : path

        if (!route.meta?.filename)
          throw new Error(`meta.filename must be specified for generated routes. Found: ${JSON.stringify(route)}`)

        const filename = route.meta.filename
        const extension = extname(path).slice(1) || '.html'

        let paths = [path]

        // Dynamic Route
        if (path.includes('/:')) {
          // @ts-ignore
          const page = await route.component().then(m => m.default) as PageComponent

          if (!page.getStaticPaths)
            console.warn(`'getStaticPaths' is not defined for ${path} so it won't be generated.`)

          paths = (await page.getStaticPaths?.() || [])
            .map(variant => router.resolve({ ...route, ...variant }).fullPath)
        }

        paths.forEach(path => {
          routesForSSG.set(path, {
            path,
            filename,
            extension,
            outputFilename: pathToFilename(path, extension),
          })
        })
      }
      if (Array.isArray(route.children))
        await addPaths(router, route.children, path.replace(/\/$/g, '')) // Remove trailing slash
    }
  }

  const app = await createApp()
  await addPaths(app.router, app.routes)
  return Array.from(routesForSSG.values())
}
