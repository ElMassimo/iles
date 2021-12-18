/* eslint-disable no-restricted-syntax */
import type { RouteLocationNormalizedLoaded, RouteParams } from 'vue-router'
import { shallowRef, watch } from 'vue'
import { computedInPage, pageFromRoute } from './composables/pageData'

export function propsFromRoute (route: RouteLocationNormalizedLoaded) {
  if (import.meta.env.SSR)
    return route.meta.ssrProps as Record<string, any>

    // Track dependencies of static paths
    // eslint-disable-next-line no-unused-expressions
    ;(route.meta.pathVariantsPromise as any).value

  const pathVariants = route.meta.pathVariants?.value || []
  const pathVariant = pathVariants.find(path => sameParams(path.params, route.params))
  if (Object.keys(route.params).length > 0 && !pathVariant)
    console.warn('This route will not be generated, unable to find matching params in `getStaticPaths`.\nFound:\n\t', route.params, '\nPaths:\n\t', pathVariants)
  return pathVariant ? { ...pathVariant.params, ...pathVariant.props } : {}
}

export async function resolveProps (route: RouteLocationNormalizedLoaded, ssrProps?: any) {
  if (import.meta.env.SSR) {
    route.meta.ssrProps = ssrProps
    return
  }

  if (!route.meta.pathVariants) {
    route.meta.pathVariants = shallowRef([])
    route.meta.pathVariantsPromise = computedInPage(() => getPathVariants(route))
    watch(route.meta.pathVariantsPromise, (promise) => {
      promise.then(pathVariants => route.meta.pathVariants!.value = pathVariants)
    })
  }

  route.meta.pathVariants!.value = await route.meta.pathVariantsPromise!.value
}

async function getPathVariants (route: RouteLocationNormalizedLoaded) {
  try {
    const page = pageFromRoute(route)

    if (page.getStaticPaths && Object.keys(route.params).length === 0)
      console.warn(`getStaticPaths provided in ${page.filename || route.path}, but path is not dynamic.`)

    const pathVariants = await page.getStaticPaths?.({ route }) || []
    if (!Array.isArray(pathVariants))
      throw new Error(`Expected array from 'getStaticPaths' in ${page.filename}, got ${JSON.stringify(pathVariants)}`)

    return pathVariants
  }
  catch (error) {
    console.error(`Error while fetching props for ${route.path}.`)
    throw error
  }
}

function sameParams (a: RouteParams, b: RouteParams) {
  return JSON.stringify(a) === JSON.stringify(b)
}
