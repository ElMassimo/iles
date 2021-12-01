/* eslint-disable no-use-before-define */
import type { ResolveFn, UserConfig as ViteOptions, ConfigEnv, PluginOption as VitePluginOption } from 'vite'
import type { GetManualChunk } from 'rollup'
import type { App, Ref, DefineComponent } from 'vue'
import type { Options as CritterOptions } from 'critters'
import type VuePlugin, { Options as VueOptions } from '@vitejs/plugin-vue'
import type PagesPlugin, { UserOptions as PagesOptions } from 'vite-plugin-pages'
import type ComponentsPlugin from 'unplugin-vue-components/vite'
import type { Options as ComponentOptions } from 'unplugin-vue-components/types'

import type { Options as SolidOptions } from 'vite-plugin-solid'
import type { Options as SvelteOptions } from '@sveltejs/vite-plugin-svelte'
import type { PreactPluginOptions as PreactOptions } from '@preact/preset-vite'

import type { Router, RouteRecordRaw, RouteMeta, RouterOptions as VueRouterOptions, RouteComponent, RouteRecordNormalized, RouteLocationNormalizedLoaded, RouteParams } from 'vue-router'
import type { HeadClient, HeadObject } from '@vueuse/head'
export type { OnLoadFn } from '@islands/hydration/dist/vanilla'

import type { MarkdownOptions } from '@islands/mdx'

export type { ViteOptions, ConfigEnv }
export type { Router, RouteRecordRaw, RouteMeta }

export type RouterOptions = VueRouterOptions & { base?: string }

export interface PageProps extends Record<string, any> {}

export interface PageFrontmatter extends Record<string, any> {
  layout?: string | false
}

export interface PageMeta {
  href: string
  filename: string
  lastUpdated: Date
}

export interface PageComponent extends RouteComponent {
  frontmatter: PageFrontmatter
  meta: PageMeta
  layoutName: string
  layoutFn: false | (() => Promise<DefineComponent>)
  getStaticPaths?: GetStaticPaths
  staticPaths: Ref<StaticPath<any>[]>
  __file?: string
}

export interface PageData<T = PageProps> {
  readonly page: Ref<PageComponent>
  readonly route: RouteLocationNormalizedLoaded
  readonly props: T
  readonly meta: PageMeta
  readonly frontmatter: PageFrontmatter
  readonly site: UserSite
}

export type HeadConfig = HeadObject

export interface CreateAppConfig {
  /**
   * Current router path on SSG, `undefined` on client side.
   */
  routePath?: string
  /**
   * Props for the current page on SSG, `undefined` on client side.
   */
  ssrProps?: any
}

export interface AppContext extends PageData {
  app: App
  config: AppClientConfig
  head: HeadClient
  router: Router
  routes: RouteRecordRaw[]
}

export interface StaticPath<T = Record<string, any>> {
  params: RouteParams
  props: T
}

export interface RouteToRender {
  path: string
  ssrProps: StaticPath['props']
  outputFilename: string
  rendered?: string
}

export interface GetStaticPathsArgs {
  route: RouteLocationNormalizedLoaded | RouteRecordNormalized
}

export type GetStaticPaths<T = any> = (args: GetStaticPathsArgs) => StaticPath<T>[] | Promise<StaticPath<T>[]>

export type CreateAppFactory = (options?: CreateAppConfig) => Promise<AppContext>

export type LayoutFactory = (name: string | false) => any

export interface NamedPlugins {
  pages: ReturnType<typeof PagesPlugin>
  vue: ReturnType<typeof VuePlugin>
  components: ReturnType<typeof ComponentsPlugin>
}

export interface BaseIlesConfig {
  /**
   * Configuration options for Vite.js
   */
  vite: ViteOptions
  /**
   * Configuration options for @vitejs/plugin-vue
   */
  vue: VueOptions
  /**
   * Configuration options for vite-plugin-pages
   */
  pages: Omit<PagesOptions, 'pagesDir' | 'react'>
  /**
   * Configuration options for unplugin-vue-components, which manages automatic
   * imports for components in Vue and MDX files.
   */
  components: ComponentOptions
  /**
   * Configuration options for @preact/preset-vite
   */
  preact?: boolean | PreactOptions
  /**
   * Configuration options for vite-plugin-solid
   */
  solid?: boolean | SolidOptions
  /**
   * Configuration options for @sveltejs/vite-plugin-svelte
   */
  svelte?: boolean | SvelteOptions
  /**
   * Configuration options for markdown processing in îles, including remark
   * and rehype plugins.
   */
  markdown: MarkdownOptions
  critters?: CritterOptions | false
}

export interface IlesModule extends Partial<BaseIlesConfig> {
  name: string
  config?: (config: UserConfig, env: ConfigEnv) => UserConfig | null | void | Promise<UserConfig | null | void>
  configResolved?: (config: AppConfig, env: ConfigEnv) => void | Promise<void>
}

export type EnhanceAppContext = AppContext
export type MDXComponents = Record<string, any>

export interface UserApp {
  head?: HeadConfig | ((ctx: EnhanceAppContext) => HeadConfig)
  enhanceApp?: (ctx: EnhanceAppContext) => void | Promise<void>
  mdxComponents?: MDXComponents | ((ctx: EnhanceAppContext) => MDXComponents | Promise<MDXComponents>)
  router?: Omit<VueRouterOptions, 'history', 'routes'>
  socialTags?: boolean
}

export type UserSite = typeof import('~/site').default & {
  url: string
  canonical: string
}

export type IlesModuleLike = IlesModule | IlesModule[] | false | null | undefined
export type IlesModuleOption = IlesModuleLike | Promise<IlesModuleLike> | string | [string, any]

export interface RequiredConfig {
  /**
   * URL for site in production, used to generate absolute URLs for sitemap.xml
   * and social meta tags. Available as `site.url` and `site.canonical`.
   * @type {string}
   */
  siteUrl: string
  /**
   * Whether to output more information about islands and hydration in development.
   * @default true
   */
  debug: boolean | 'log'
  /**
   * Which framework to use to process `.jsx` and `.tsx` files.
   */
  jsx?: 'vue' | 'preact' | 'solid'
  /**
   * Specify the output directory (relative to project root).
   * @default 'dist'
   */
  outDir: string
  /**
   * Specify the layouts directory (relative to srcDir).
   * @default 'layouts'
   */
  layoutsDir: string
  /**
   * Specify the pages directory (relative to srcDir).
   * @default 'pages'
   */
  pagesDir: string
  /**
   * Specify the directory where the app source is located (relative to project root).
   * @default 'src'
   */
  srcDir: string
  tempDir: string
  /**
   * Specify the directory to nest generated assets under (relative to outDir).
   * @default 'assets'
   */
  assetsDir: string
  ssg: {
    manualChunks?: GetManualChunk
    /**
     * Whether to generate a sitemap.xml and inject the meta tag referencing it.
     * NOTE: Must provide siteUrl to enable sitemap generation.
     * @default true
     */
    sitemap?: boolean
  }
}

export interface UserConfig extends Partial<RequiredConfig>, Partial<IlesModule> {
  modules?: IlesModuleOption[]
}

export interface AppConfig extends RequiredConfig, BaseIlesConfig {
  base: string
  root: string
  configPath: string
  pages: PagesOptions & {
    /**
     * Whether to build treat .html files in the site as entrypoints.
     * @default false
     */
    htmlEntrypoints?: boolean
  }
  modules: IlesModule[]
  namedPlugins: NamedPlugins
  vitePlugins: VitePluginOption[]
  resolvePath: ResolveFn
}

export type AppClientConfig = Pick<AppConfig, 'base' | 'root' | 'debug' | 'ssg' | 'siteUrl' | 'jsx'>

export interface IslandDefinition {
  id: string
  script: string
  placeholder: string
  componentPath: string
  entryFilename?: string
}

export type IslandsByPath = Record<string, IslandDefinition[]>

export type Awaited<T> = T extends PromiseLike<infer U> ? Awaited<U> : T
