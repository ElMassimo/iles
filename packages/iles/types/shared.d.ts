/* eslint-disable no-use-before-define */
import type { UserConfig as ViteOptions, ConfigEnv } from 'vite'

import type { Options as VueOptions } from '@vitejs/plugin-vue'
import type { UserOptions as PagesOptions } from 'vite-plugin-pages'
import type { Options as ComponentOptions } from 'unplugin-vue-components/types'
import type VueJsxPlugin from '@vitejs/plugin-vue-jsx'
import type { PluginOptions as XdmOptions } from 'vite-plugin-xdm'

import type { Router, RouteRecordRaw, RouterOptions as VueRouterOptions, RouteMeta } from 'vue-router'
import type { HeadClient, HeadObject } from '@vueuse/head'

export { ViteOptions, ConfigEnv }

export type { Router, RouteRecordRaw }
export type PageMeta = RouteMeta
export type RouterOptions = PartialKeys<VueRouterOptions, 'history'> & { base?: string }

export type HeadConfig = HeadObject

export interface CreateAppConfig {
  inBrowser: boolean
  /**
   * Current router path on SSG, `undefined` on client side.
   */
  routePath?: string
}

export interface SSGContext extends CreateAppConfig {
  app: App<Element>
  router: Router
  routes: RouteRecordRaw[]
  initialState: Record<string, any>
  head: HeadClient | undefined
}

export type CreateAppFactory = (options: CreateAppConfig) => Promise<SSGContext<true> | SSGContext<false>>

export interface AppPlugins {
  vite: ViteOptions
  vue: VueOptions
  pages: PagesOptions
  components: ComponentOptions
  vueJsx: Parameters<typeof VueJsxPlugin>[0]
  markdown: XdmOptions
}

export interface Plugin extends Partial<AppPlugins> {
  head?: HeadConfig
  config: (config: UserConfig, env: ConfigEnv) => UserConfig | null | void | Promise<UserConfig | null | void>
  enhanceApp: (ctx: EnhanceAppContext) => void | Promise<void>
}

export type PluginOption = Plugin | false | null | undefined

export interface RequiredConfig {
  base: string
  title: string
  description: string
  outDir: string
  layoutsDir: string
  srcDir: string
  tempDir: string
}

export interface UserConfig extends Partial<RequiredConfig>, Partial<Plugin> {
  plugins?: (PluginOption | PluginOption[])[]
}

export interface AppConfig extends RequiredConfig, AppPlugins {
  root: string
  configPath?: string
  plugins: Plugin[]
}
