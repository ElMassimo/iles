/// <reference types="vite/client" />
/// <reference types="vue/ref-macros" />

import Plugin from '../dist/node/plugin'
import type { PageFrontmatter, PageMeta, UserSite, StaticPath } from './shared'

export default Plugin
export * from './shared'
export * from './router'
export * from './virtual'
export * from '../dist/client/index'
export * from '../dist/node/index'

import 'vue-router'

declare module 'vue-router' {
  interface RouteMeta {
    filename: string
    layout?: import('vue').Ref<import('vue').DefineComponent | false>
    pathVariants?: import('vue').Ref<StaticPath[]>
  }
}

declare module '@vue/runtime-core' {
  export interface ComponentCustomProperties {
    /**
     * The frontmatter of the current page.
     */
    $frontmatter: PageFrontmatter
    /**
     * Information about the current page, including href and filename.
     */
    $meta: PageMeta
    /**
     * Information about the site as exported in src/site.ts
     */
    $site: UserSite
  }
}

declare global {
  interface Window {}
}
