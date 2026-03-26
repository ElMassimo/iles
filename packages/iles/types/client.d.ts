import type {
  PageFrontmatter,
  PageMeta,
  UserSite,
  StaticPath,
  Router,
  RouteLocationNormalizedLoaded,
} from './shared'

declare module 'vue-router' {
  interface RouteMeta {
    layout?: import('vue').Ref<import('vue').DefineComponent | false>
    pathVariants?: import('vue').Ref<StaticPath[]>
    pathVariantsPromise?: import('vue').ComputedRef<Promise<StaticPath[]>>
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
