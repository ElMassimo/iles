// exports in this file are exposed to the client app via 'iles'
// so the user can do `import { usePage } from 'iles'`

// Generic Types
export type { Router, RouteRecordRaw } from './shared'

// Composables
export { useAppConfig } from './app/composables/appConfig'
export { usePage, computedInPage } from './app/composables/pageData'
export { useFile } from './app/composables/file'
export { useMDXComponents, provideMDXComponents } from './app/composables/mdxComponents'
export { useVueRenderer, VueRenderable } from './app/composables/vueRenderer'
export { useRouter, useRoute } from 'vue-router'
export { useHead } from '@vueuse/head'

import type { ComponentOptionsWithoutProps, ComputedRef } from 'vue'
import { UserApp, GetStaticPaths, Document } from '../../types/shared'

export function useDocuments<T = void> (globPattern: string): ComputedRef<Document<T>[]> {
  throw new Error(`Unresolved useDocuments('${globPattern}')`)
}

export function defineApp (app: UserApp) {
  return app
}

export function definePageComponent<T> (page: ComponentOptionsWithoutProps<T> & { getStaticPaths?: GetStaticPaths<T> }) {
  return page
}
