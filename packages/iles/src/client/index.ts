// exports in this file are exposed to themes and md files via 'iles'
// so the user can do `import { useRoute, useSiteData } from 'iles'`

// generic types
import type { IslandsAppConfig } from './shared'
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

export function defineConfig (config: Partial<IslandsAppConfig>) {
  return config
}
