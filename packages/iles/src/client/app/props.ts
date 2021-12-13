/* eslint-disable no-restricted-syntax */
import type { RouteLocationNormalizedLoaded, RouteParams } from 'vue-router'
import { shallowRef } from 'vue'
import { pageFromRoute } from './composables/pageData'

export function propsFromRoute (route: RouteLocationNormalizedLoaded) {
  if (import.meta.env.SSR)
    return route.meta.ssrProps as Record<string, any>

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

  const page = pageFromRoute(route)
  try {
    if (page.getStaticPaths && Object.keys(route.params).length === 0)
      console.warn(`getStaticPaths provided in ${page.filename || route.path}, but path is not dynamic.`)

    const pathVariants = await page.getStaticPaths?.({ route }) || []
    if (!Array.isArray(pathVariants))
      throw new Error(`Expected array from 'getStaticPaths' in ${page.filename}, got ${JSON.stringify(pathVariants)}`)

    if (route.meta.pathVariants)
      route.meta.pathVariants.value = pathVariants
    else
      route.meta.pathVariants = shallowRef(pathVariants)
  }
  catch (error) {
    console.error(`Error while fetching props for ${route.path}.`)
    throw error
  }
}

function sameParams (a: RouteParams, b: RouteParams) {
  return JSON.stringify(a) === JSON.stringify(b)
}
