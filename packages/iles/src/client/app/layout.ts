import type { RouteLocationNormalizedLoaded } from 'vue-router'
import { shallowRef } from 'vue'
import { pageFromRoute } from './composables/pageData'

export async function resolveLayout (route: RouteLocationNormalizedLoaded) {
  const page = pageFromRoute(route)
  try {
    const layout = page.layoutFn === false ? false : await page.layoutFn?.()
    if (route.meta.layout)
      route.meta.layout.value = layout
    else
      route.meta.layout = shallowRef(layout)
  }
  catch (error) {
    console.error(`Error while fetching '${page?.layoutName}' layout.`)
    throw error
  }
}
