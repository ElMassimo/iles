// exports in this file are exposed to themes and md files via 'iles'
// so the user can do `import { useRoute, useSiteData } from 'iles'`
import { EnhanceAppContext } from './app/theme'

// generic types
import type { HeadConfig } from './shared'
export type { Router, RouteRecordRaw } from 'vue-router'

// theme types
export type { Theme, EnhanceAppContext } from './app/theme'

// composables
export { useData } from './app/data'
export { useRouter, useRoute } from 'vue-router'
export { useHead } from '@vueuse/head'

// utilities
export { inBrowser, withBase } from './app/utils'

// components
export * from './app/components'

interface IslandsAppConfig {
  title: string
  description: string
  enhanceApp?: (ctx: EnhanceAppContext) => void | Promise<void>
}

export function defineConfig (config: { head?: HeadConfig } & Partial<IslandsAppConfig>) {
  return config
}
