import type { ViteDevServer } from 'vite'
import type { RouteRecordRaw } from 'vue-router'

export const MODULE_ID = '@islands/routes'

type Awaitable<T> = T | Promise<T>

export { PagesApi } from './api'

export interface PageMatter {
  frontmatter: PageFrontmatter
  meta: PageMeta
  layout: false | string
  route: Pick<RouteRecordRaw, 'name' | 'path' | 'redirect' | 'alias'>
}

export interface PageMeta extends Record<string, any> {
  filename: string
  href: string
}

export interface PageFrontmatter extends Record<string, any> {}

/**
 * The definition of a route in îles, used to render pages.
 *
 * By default most routes would be inferred from files in the pagesDir, but a
 * user might provide custom routes using the `extendRoutes` hook.
 */
export interface PageRoute {
  /**
   * Name for the route, can be use as a shortcut in <router-link>.
   */
  name?: string
  /**
   * Path of the record. Should start with `/`.
   *
   * @example `/projects/:name` matches `/projects/vue` as well as `/projects/iles`.
   */
  path: string
  /**
   * Where to redirect if the route is directly matched. When building the site,
   * any routes with `redirect` will use <meta http-equiv="refresh">.
   */
  redirect?: string
  /**
   * Additional paths for the page, that behave like a copy of the route.
   * When building the site, each path will be rendered separately.
   */
  alias?: string | string[]
  /**
   * Filename of the component associated with the route.
   */
  componentFilename: string
  /**
   * Frontmatter associated with the page.
   */
  frontmatter?: PageMatter
}

export type PagesOptions = {
  /**
   * Relative path to the srcDir where page components are located.
   * @default 'pages'
   */
  pagesDir?: string
  /**
   * Allowed extensions of page files.
   * @default ['vue', 'md', 'mdx']
   */
  pageExtensions?: string[]
  /**
   * Use this hook to modify the frontmatter for pages and MDX files.
   * See `extendRoute` if you only want to modify route information.
   */
  extendFrontmatter?: (frontmatter: PageMatter, filename: string, page: undefined | PageRoute) => Awaitable<PageMatter | void>
  /**
   * Use this hook to modify route
   * See `extendFrontmatter` if you want to add metadata.
   */
  extendRoute?: (route: PageRoute) => Awaitable<PageRoute | void>
  /**
   * Use this hook to access the generated routes, and modify them (optional).
   */
  extendRoutes?: (routes: PageRoute[]) => Awaitable<PageRoute[] | void>
}

interface ResolvedOptions extends Omit<PagesOptions, 'pagesDir' | 'pageExtensions'> {
  /**
   * Absolute path to the directory that contains the page files.
   */
  pagesDir: string
  /**
   * Allowed extensions of page files.
   */
  pageExtensions: string[]
  /**
   * Used to notify errors in a user-friendly way.
   */
  server?: ViteDevServer
}

export interface ResolvedOptions extends Options {
  pagesDir: PageDirOptions[]
  server?: ViteDevServer
}
