import { App, InjectionKey, Ref, computed, ref, inject } from 'vue'
import { RouteLocationNormalizedLoaded } from 'vue-router'
import { PageData, PageComponent } from '../../shared'

export const dataSymbol: InjectionKey<PageData> = Symbol('[iles-page-data]')

function last <T>(arr: T[]) {
  return arr[arr.length - 1]
}

export function installPageData (app: App, currentRoute: Ref<RouteLocationNormalizedLoaded>): PageData {
  const _lastPageChange = ref(new Date())
  const route = computed(() => {
    // eslint-disable-next-line no-unused-expressions
    _lastPageChange.value // track dependency to recompute as needed.
    return currentRoute.value
  })
  Object.assign(route, { forceUpdate: () => _lastPageChange.value = new Date() })

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
