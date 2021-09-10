// exports in this file are exposed to themes and md files via 'iles'
// so the user can do `import { useRoute, useSiteData } from 'iles'`

// Generic Types
export type { Router, RouteRecordRaw } from './shared'

// Composables
export { usePage } from './app/pageData'
export { useRouter, useRoute } from 'vue-router'
export { useHead } from '@vueuse/head'

// Utilities
export { inBrowser } from './app/utils'
export { defineConfig } from './shared'

// Components
export * from './app/components'
