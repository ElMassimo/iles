import { App, InjectionKey, Ref, computed, inject } from 'vue'
import { RouteLocationNormalizedLoaded } from 'vue-router'
import { PageMeta } from '../../shared'

export interface PageData<T = any> {
  route: Ref<RouteLocationNormalizedLoaded>
  meta: Ref<PageMeta>
  frontmatter: Ref<Record<string, any>>
}

export const dataSymbol: InjectionKey<PageData> = Symbol('[iles-page-data]')

export function installPageData (app: App, route: Ref<RouteLocationNormalizedLoaded>): PageData {
  const pageData: PageData = {
    route,
    meta: computed(() => route.value.meta),
    frontmatter: computed(() => route.value.meta.frontmatter || {}),
  }
  app.provide(dataSymbol, pageData)
  return pageData
}

export function usePage<T = any> (app?: App): PageData<T> {
  const data = app ? app._context.provides[dataSymbol as any] : inject(dataSymbol)
  if (!data) throw new Error('Page data not properly injected in app')
  return data
}
