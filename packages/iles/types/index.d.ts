/// <reference types="vite/client" />
/// <reference types="vue/macros-global" />

import Plugin from '../dist/node/plugin/plugin'
import type {
  PageFrontmatter,
  PageMeta,
  UserSite,
  StaticPath,
  Router,
  RouteLocationNormalizedLoaded,
} from './shared'

export default Plugin
export * from './shared'
export * from '../dist/client/index'
export * from '../dist/node/index'

import 'vue-router'
import './virtual'

declare module 'vue-router' {
  interface RouteMeta {
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
    /**
     * Normalized current location. See {@link RouteLocationNormalizedLoaded}.
     */
    $route: RouteLocationNormalizedLoaded
    /**
     * {@link Router} instance used by the application.
     */
    $router: Router
  }
}

declare global {
  interface Window {}
}
