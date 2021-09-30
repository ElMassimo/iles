import { App, InjectionKey, Ref, computed, inject } from 'vue'
import { RouteLocationNormalizedLoaded } from 'vue-router'
import { PageData, PageComponent } from '../../shared'

export const dataSymbol: InjectionKey<PageData> = Symbol('[iles-page-data]')

function last <T>(arr: T[]) {
  return arr[arr.length - 1]
}

export function installPageData (app: App, route: Ref<RouteLocationNormalizedLoaded>): PageData {
  const page = computed(() => last(route.value.matched)?.components?.default as PageComponent || {})
  const meta = computed(() => page.value.meta || {})
  const frontmatter = computed(() => page.value.frontmatter || {})

  const pageData: PageData = { route, page, meta, frontmatter }
  app.provide(dataSymbol, pageData)
  return pageData
}

export function usePage<T = any> (app?: App): PageData<T> {
  const data = app ? app._context.provides[dataSymbol as any] : inject(dataSymbol)
  if (!data) throw new Error('Page data not properly injected in app')
  return data
}
