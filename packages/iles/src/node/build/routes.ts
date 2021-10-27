import { PageComponent } from 'iles'
import { extname } from 'pathe'
import type { RouteComponent, RouteRecordNormalized } from 'vue-router'
import type { AppConfig, CreateAppFactory, Router, RouteToRender } from '../shared'
import { pathToFilename } from './utils'

const DYNAMIC_PARAM = '/:'

export async function getRoutesToRender (config: AppConfig, createApp: CreateAppFactory) {
  const routesToRender = new Map<string, RouteToRender>()
  const { router } = await createApp()

  for (const path of await resolveRoutesToRender(router)) {
    const extension = extname(path).slice(1) || '.html'
    const outputFilename = pathToFilename(path, extension)
    routesToRender.set(path, { path, outputFilename })
  }

  return Array.from(routesToRender.values())
}

async function resolveRoutesToRender (router: Router) {
  const toResolvedPath = (route: any) => {
    try {
      return router.resolve(route).fullPath
    }
    catch (error) {
      throw new Error(`Could not resolve ${String(route.name)}. Params: ${JSON.stringify(route.params)}. Error: ${error.message}`)
    }
  }

  return (await Promise.all(router.getRoutes().map(async route => {
    const routes = route.path.includes(DYNAMIC_PARAM) ? await getDynamicPaths(route) : [route]
    return routes.map(toResolvedPath)
  }))).flat()
}

async function getDynamicPaths (route: RouteRecordNormalized) {
  const { components: { default: component }, path } = route
  const file = route.meta?.filename || String(route.name)

  const page: PageComponent | undefined = isLazy(component)
    ? await component().then(m => 'default' in m ? m.default : m)
    : component

  const variants = await page?.getStaticPaths?.()
  if (!variants) {
    console.warn(`'getStaticPaths' is not defined for ${file} so ${path} it won't be generated.`)
    return []
  }
  if (!Array.isArray(variants))
    throw new Error(`Expected array from 'getStaticPaths' in ${file}, got: ${JSON.stringify(variants)}`)

  return variants.map(({ params }) => ({ ...route, params }))
}

function isLazy (value: RouteRecordNormalized['components']['default']): value is () => Promise<RouteComponent> {
  return typeof value === 'function'
}

export function toArray<T>(array?: T | T[]): T[] {
  array = array || []
  if (Array.isArray(array))
    return array
  return [array]
}
