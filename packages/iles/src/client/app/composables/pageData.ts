import type { App, Ref, InjectionKey } from 'vue'
import type { RouteLocationNormalizedLoaded } from 'vue-router'
import { computed, ref, inject } from 'vue'
import { routeLocationKey } from 'vue-router'
import type { PageData, PageProps, PageComponent, UserSite } from '../../shared'
import { propsFromRoute } from '../props'
import { toReactive } from './reactivity'

export const pageDataKey: InjectionKey<PageData> = Symbol('[iles-page-data]')

function last <T> (arr: T[]) {
  return arr[arr.length - 1]
}

function injectFromApp <T> (key: InjectionKey<T>, app?: App) {
  const result = app ? app._context.provides[key as any] as T : inject(key)
  if (!result) throw new Error('Page data not properly injected in app. Are you using it inside an island?')
  return result
}

const _lastPageChange = ref(new Date())
export const forcePageUpdate = () => { _lastPageChange.value = new Date() }

const computedInPage = <T>(fn: () => T) => {
  return computed<T>(() => {
    // eslint-disable-next-line no-unused-expressions
    _lastPageChange.value // track dependency to recompute as needed.
    return fn()
  })
}

export function pageFromRoute (route: RouteLocationNormalizedLoaded) {
  return (last(route.matched)?.components?.default || {}) as PageComponent
}

function reactiveFromFn <T extends object> (fn: () => T): T {
  return toReactive<T>(computed(fn))
}

export function installPageData (app: App, siteRef: Ref<UserSite>): PageData {
  const route = injectFromApp(routeLocationKey, app)
  const page = computedInPage(() => pageFromRoute(route))
  const meta = reactiveFromFn(() => ({ ...page.value.meta, href: route.path }))
  const frontmatter = reactiveFromFn(() => page.value.frontmatter || {})
  const props = computedInPage(() => propsFromRoute(route))
  const site = toReactive(siteRef)

  const pageData: PageData = { route, page, meta, frontmatter, site, props }
  app.provide(pageDataKey, pageData)
  return pageData
}

export function usePage<T extends PageProps = PageProps> (app?: App): PageData<T> {
  return injectFromApp<PageData<T>>(pageDataKey, app)
}
