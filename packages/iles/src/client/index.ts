// exports in this file are exposed to themes and md files via 'iles'
// so the user can do `import { useRoute, useSiteData } from 'iles'`

// generic types
export type { Router, Route } from './app/router'

// theme types
export type { Theme, EnhanceAppContext } from './app/theme'

// composables
export { useData } from './app/data'
export { useRouter, useRoute } from './app/router'

// utilities
export { inBrowser, withBase } from './app/utils'

// components
export * from './app/components'
