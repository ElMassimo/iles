/* eslint-disable no-use-before-define */
import type { UserConfig as ViteConfig, ConfigEnv } from 'vite'

import type VuePlugin from '@vitejs/plugin-vue'
import type PagesPlugin from 'vite-plugin-pages'
import type LayoutsPlugin from 'vite-plugin-vue-layouts'
import type ComponentsPlugin from 'unplugin-vue-components/vite'
import type VueJsxPlugin from '@vitejs/plugin-vue-jsx'
import type XdmPlugin from 'vite-plugin-xdm'

import type { Router, RouteRecordRaw, RouterOptions as VueRouterOptions, RouteMeta } from 'vue-router'
import type { HeadClient, HeadObject } from '@vueuse/head'

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

export interface Plugin {
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
  pagesDir: string
  srcDir: string
  tempDir: string
  plugins: (PluginOption | PluginOption[])[]
}

export interface UserConfig extends Partial<RequiredConfig> {
  head?: HeadConfig
  vite?: ViteConfig
  vue?: Parameters<typeof VuePlugin>[0]
  pages?: Parameters<typeof PagesPlugin>[0]
  layouts?: Parameters<typeof LayoutsPlugin>[0]
  components?: Parameters<typeof ComponentsPlugin>[0]
  vueJsx?: Parameters<typeof VueJsxPlugin>[0]
  markdown?: Parameters<typeof XdmPlugin>[0]
}

export interface AppConfig extends RequiredConfig, UserConfig {
  root: string
}
