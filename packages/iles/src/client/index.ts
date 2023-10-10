// exports in this file are exposed to the client app via 'iles'
// so the user can do `import { usePage } from 'iles'`

// Generic Types
export type { Router, RouteRecordRaw } from './shared'
export type { VueRenderable } from './app/composables/vueRenderer'

// Composables
export { useAppConfig } from './app/composables/appConfig'
export { usePage, computedInPage } from './app/composables/pageData'
export { useMDXComponents, provideMDXComponents } from './app/composables/mdxComponents'
export { useVueRenderer } from './app/composables/vueRenderer'
export { useRouter, useRoute } from 'vue-router'
export { useHead } from '@unhead/vue'

import type { ComponentOptionsWithoutProps, ComputedRef } from 'vue'
import type { UserApp, GetStaticPaths, Document } from '../../types/shared'

export function useDocuments<T = void> (globPattern: string): ComputedRef<Document<T>[]> {
  throw new Error(`Unresolved useDocuments('${globPattern}')`)
}

export function defineApp (app: UserApp) {
  return app
}

export function definePageComponent<T> (page: ComponentOptionsWithoutProps<T> & { getStaticPaths?: GetStaticPaths<T> }) {
  return page
}
