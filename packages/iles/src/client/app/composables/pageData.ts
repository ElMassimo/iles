import { App, InjectionKey, Ref, computed, ref, inject } from 'vue'
import { RouteLocationNormalizedLoaded } from 'vue-router'
import type { PageData, PageComponent, UserSite } from '../../shared'

export const dataSymbol: InjectionKey<PageData> = Symbol('[iles-page-data]')

function last <T>(arr: T[]) {
  return arr[arr.length - 1]
}

const _lastPageChange = ref(new Date())
const computedInPage = <T>(fn: () => T) => {
  const computedRef = computed<T>(() => {
    // eslint-disable-next-line no-unused-expressions
    _lastPageChange.value // track dependency to recompute as needed.
    return fn()
  })
  ;(computedRef as any).forceUpdate = forceUpdate
  return computedRef
}
const forceUpdate = () => { _lastPageChange.value = new Date() }

export function pageFromRoute (route: RouteLocationNormalizedLoaded) {
  return (last(route.matched)?.components?.default || {}) as PageComponent
}

export function installPageData (app: App, site: UserSite, currentRoute: Ref<RouteLocationNormalizedLoaded>): PageData {
  const route = computedInPage(() => currentRoute.value)
  const page = computedInPage(() => pageFromRoute(route.value))
  const meta = computedInPage(() => page.value.meta || {})
  const frontmatter = computedInPage(() => page.value.frontmatter || {})

  const pageData: PageData = { route, page, meta, frontmatter, site }
  app.provide(dataSymbol, pageData)
  return pageData
}

export function usePage<T = any> (app?: App): PageData<T> {
  const data = app ? app._context.provides[dataSymbol as any] : inject(dataSymbol)
  if (!data) throw new Error('Page data not properly injected in app')
  return data
}
