/* eslint-disable no-restricted-syntax */
import type { App, Ref, InjectionKey } from 'vue'
import type { RouteLocationNormalizedLoaded, RouteParams } from 'vue-router'
import { computed, ref, inject } from 'vue'
import { routeLocationKey } from 'vue-router'
import type { PageData, PageProps, PageComponent, UserSite, StaticPath } from '../../shared'
import { toReactive } from './reactivity'

export const pageDataKey: InjectionKey<PageData> = Symbol('[iles-page-data]')

function last <T> (arr: T[]) {
  return arr[arr.length - 1]
}

function shallowEqual (a: RouteParams, b: RouteParams) {
  for (const key in a)
    if (!(key in b) || a[key] !== b[key]) return false
  for (const key in b)
    if (!(key in a) || a[key] !== b[key]) return false
  return true
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
  const currentPath = (path: StaticPath<any>) => shallowEqual(path.params, route.params)
  const page = computedInPage(() => pageFromRoute(route))
  const meta = reactiveFromFn(() => ({ ...page.value.meta, href: route.path }))
  const frontmatter = reactiveFromFn(() => page.value.frontmatter || {})
  const props = computedInPage(() => {
    const pathVariants = route.meta.pathVariants?.value || []
    const pathVariant = pathVariants.find(currentPath)
    if (Object.keys(route.params).length > 0 && !pathVariant)
      console.warn('This route will not be generated, unable to find matching params in `getStaticPaths`.\nFound:\n\t', route.params, '\nPaths:\n\t', pathVariants)
    return pathVariant?.props || {}
  })
  const site = toReactive(siteRef)

  const pageData: PageData = { route, page, meta, frontmatter, site, props }
  app.provide(pageDataKey, pageData)
  return pageData
}

export function usePage<T extends PageProps = PageProps> (app?: App): PageData<T> {
  return injectFromApp<PageData<T>>(pageDataKey, app)
}
