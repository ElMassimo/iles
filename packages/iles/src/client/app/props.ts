import type { RouteLocationNormalizedLoaded } from 'vue-router'
import { shallowRef } from 'vue'
import { pageFromRoute } from './composables/pageData'

export async function resolveProps (route: RouteLocationNormalizedLoaded) {
  const page = pageFromRoute(route)
  try {
    if (page.getStaticPaths && Object.keys(route.params).length === 0)
      console.warn(`getStaticPaths provided in ${page.__file || route.path}, but path is not dynamic.`)

    const pathVariants = await page.getStaticPaths?.() || []
    if (!Array.isArray(pathVariants))
      throw new Error(`Expected array from 'getStaticPaths' in ${page.__file}, got ${JSON.stringify(pathVariants)}`)

    if (route.meta.pathVariants)
      route.meta.pathVariants.value = pathVariants
    else
      route.meta.pathVariants = shallowRef(pathVariants)
  }
  catch (error) {
    console.error(`Error while fetching props for ${route.path}.\n`, error)
  }
}
