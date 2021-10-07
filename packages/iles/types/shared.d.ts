/* eslint-disable no-use-before-define */
import type { UserConfig as ViteOptions, ConfigEnv } from 'vite'
import type { App, Ref, DefineComponent } from 'vue'
import type { Options as CritterOptions } from 'critters'
import type { Options as VueOptions } from '@vitejs/plugin-vue'
import type PagesPlugin, { UserOptions as PagesOptions } from 'vite-plugin-pages'
import type { Options as ComponentOptions } from 'unplugin-vue-components/types'
import type VueJsxPlugin from '@vitejs/plugin-vue-jsx'
import type XdmPlugin, { PluginOptions as XdmOptions } from 'vite-plugin-xdm'
import type { FrontmatterOptions } from '@islands/frontmatter'
import type { Router, RouteRecordRaw, RouteMeta, RouterOptions as VueRouterOptions, RouteComponent, RouteLocationNormalizedLoaded } from 'vue-router'
import type { HeadClient, HeadObject } from '@vueuse/head'

export { ViteOptions, ConfigEnv }

export type { Router, RouteRecordRaw, RouteMeta }
export type RouterOptions = VueRouterOptions & { base?: string }

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
}

export interface PageData<T = any> {
  readonly page: Ref<PageComponent>
  readonly route: Ref<RouteLocationNormalizedLoaded>
  readonly meta: Ref<PageMeta>
  readonly frontmatter: PageFrontmatter
  readonly site: UserSite
}

export type HeadConfig = HeadObject

export interface CreateAppConfig {
  /**
   * Current router path on SSG, `undefined` on client side.
   */
  routePath?: string
}

export interface AppContext extends Required<CreateAppConfig>, PageData {
  app: App
  head: HeadClient
  router: Router
  routes: RouteRecordRaw[]
}

export interface SSGRoute {
  path: string
  filename: string
  extension: string
  outputFilename: string
  rendered?: string
}

export type CreateAppFactory = (options?: CreateAppConfig) => Promise<AppContext>

export type LayoutFactory = (name: string | false) => any

export interface AppPlugins {
  vite: ViteOptions
  vue: VueOptions
  pages: Omit<PagesOptions, 'pagesDir' | 'react'>
  components: ComponentOptions
  vueJsx: Parameters<typeof VueJsxPlugin>[0]
  markdown: XdmOptions & FrontmatterOptions
  critters?: CritterOptions | false
}

export interface Plugin extends Partial<AppPlugins> {
  name: string
  config?: (config: UserConfig, env: ConfigEnv) => UserConfig | null | void | Promise<UserConfig | null | void>
}

export type EnhanceAppContext = AppContext

export interface UserApp {
  head?: HeadConfig | ((ctx: EnhanceAppContext) => HeadConfig)
  enhanceApp?: (ctx: EnhanceAppContext) => void | Promise<void>
  router?: Omit<VueRouterOptions, 'history', 'routes'>
}

export type UserSite = typeof import('~/site').default

export type PluginOption = Plugin | false | null | undefined

export interface RequiredConfig {
  siteUrl: string
  debug: boolean | 'log'
  outDir: string
  layoutsDir: string
  pagesDir: string
  srcDir: string
  tempDir: string
  assetsDir: string
  ssg: {
    sitemap?: boolean
  }
}

export interface UserConfig extends Partial<RequiredConfig>, Partial<Plugin> {
  plugins?: (PluginOption | PluginOption[])[]
}

export interface AppConfig extends RequiredConfig, AppPlugins {
  base: string
  root: string
  configPath: string
  pages: PagesOptions
  plugins: Plugin[]
  namedPlugins: {
    pages: PagesPlugin
    markdown: XdmPlugin
  }
}

export type AppClientConfig = Pick<AppConfig, 'base' | 'root' | 'debug' | 'ssg'>

export interface IslandDefinition {
  id: string
  script: string
  placeholder: string
  entryFilename?: string
}

export type IslandsByPath = Record<string, IslandDefinition[]>

export type Awaited<T> = T extends PromiseLike<infer U> ? Awaited<U> : T
