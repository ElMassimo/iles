import { App, InjectionKey, Ref, computed, inject } from 'vue'
import { RouteLocationNormalizedLoaded } from 'vue-router'
import { PageMeta } from '../shared'

export interface PageData<T = any> {
  meta: Ref<PageMeta>
  frontmatter: Ref<PageMeta['frontmatter']>
}

export const dataSymbol: InjectionKey<PageData> = Symbol('ilesPageData')

export function installPageData (app: App, route: Ref<RouteLocationNormalizedLoaded>): PageData {
  const pageData: PageData = {
    meta: computed(() => route.value.meta),
    frontmatter: computed(() => route.value.meta.frontmatter),
  }
  app.provide(dataSymbol, pageData)
  return pageData
}

export function usePage<T = any> (): PageData<T> {
  const data = inject(dataSymbol)
  if (!data) throw new Error('Page data not properly injected in app')
  return data
}
