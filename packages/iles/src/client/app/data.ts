import { InjectionKey, Ref, shallowRef, readonly, computed, inject } from 'vue'
import serializedSiteData from '@siteData'
import { RouteLocationNormalizedLoaded } from 'vue-router'
import { resolveSiteDataByRoute, PageData, SiteData } from '../shared'
import { withBase } from './utils'

export interface IslandsData<T = any> {
  site: Ref<SiteData<T>>
  page: Ref<PageData>
  theme: Ref<T>
  frontmatter: Ref<PageData['frontmatter']>
  title: Ref<string>
  description: Ref<string>
  lang: Ref<string>
  localePath: Ref<string>
}

export const dataSymbol: InjectionKey<IslandsData> = Symbol('islandsData')

// site data is a singleton
export type SiteDataRef<T = any> = Ref<SiteData<T>>

export const siteDataRef: Ref<SiteData> = shallowRef(parse(serializedSiteData))

function parse (data: string): SiteData {
  return readonly(JSON.parse(data)) as SiteData
}

// hmr
if (import.meta.hot) {
  import.meta.hot!.accept('/@siteData', (m) => {
    siteDataRef.value = parse(m.default)
  })
}

// per-app data
export function initData (route: Ref<RouteLocationNormalizedLoaded>): IslandsData {
  const site = computed(() =>
    resolveSiteDataByRoute(siteDataRef.value, route.value.path),
  )

  return {
    site,
    theme: computed(() => site.value.themeConfig),
    page: computed(() => route.value.meta),
    frontmatter: computed(() => route.value.meta.frontmatter),
    lang: computed(() => site.value.lang),
    localePath: computed(() => {
      const { langs, lang } = site.value
      const path = Object.keys(langs).find(
        langPath => langs[langPath].lang === lang,
      )
      return withBase(path || '/')
    }),
    title: computed(() => {
      return route.value.meta.title
        ? `${route.value.meta.title} | ${site.value.title}`
        : site.value.title
    }),
    description: computed(() => {
      return route.value.meta.description || site.value.description
    }),
  }
}

export function useData<T = any> (): IslandsData<T> {
  const data = inject(dataSymbol)
  if (!data)
    throw new Error('Islands data not properly injected in app')

  return data
}
