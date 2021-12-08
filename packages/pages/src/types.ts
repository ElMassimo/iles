import type { ViteDevServer } from 'vite'

export const MODULE_ID = '@islands/routes'

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
  name: string
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
  component: string
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
   * Use this hook to modify route
   * See `extendFrontmatter` if you want to add metadata.
   */
  extendRoute?: (route: PageRoute, parent: PageRoute | undefined) => PageRoute | void
  /**
   * Use this hook to access the generated routes, and modify them (optional).
   */
  extendRoutes?: (routes: PageRoute[]) => PageRoute[] | void | Promise<PageRoute[] | void>
}

interface ResolvedOptions extends PagesOptions {
  isPage: (file: string) => boolean
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
  server: ViteDevServer
}

export type PagesByFile = Map<string, PageRoute>

export interface ResolvedOptions extends Options {
  /**
   * Resolves to the `root` value from Vite config.
   * @default config.root
   */
  root: string
  /**
   * RegExp to match extensions
   */
  extensionsRE: RegExp
  pagesDir: PageDirOptions[]
  server?: ViteDevServer
}

export interface PagesApi {
  pageForFile: (filename: string) => ResolvedPage | undefined
}
