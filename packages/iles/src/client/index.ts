// exports in this file are exposed to themes and md files via 'iles'
// so the user can do `import { useRoute, useSiteData } from 'iles'`

// Generic Types
export type { Router, RouteRecordRaw } from './shared'

// Composables
export { useAppConfig } from './app/composables/appConfig'
export { usePage } from './app/composables/pageData'
export { useFile } from './app/composables/file'
export { useVueRenderer } from './app/composables/vueRenderer'
export { plainText } from './app/renderers/plainText'
export { useRouter, useRoute } from 'vue-router'
export { useHead } from '@vueuse/head'

// Utilities
export { inBrowser } from './app/utils'
export { defineApp, defineConfig } from './shared'

// Components
export * from './app/components'
