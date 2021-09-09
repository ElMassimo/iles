/* eslint-disable no-use-before-define */
// types shared between server and client

import type { UserConfig as ViteConfig } from 'vite'

import type VuePlugin from '@vitejs/plugin-vue'
import type PagesPlugin from 'vite-plugin-pages'
import type LayoutsPlugin from 'vite-plugin-vue-layouts'
import type ComponentsPlugin from 'unplugin-vue-components/vite'
import type VueJsxPlugin from '@vitejs/plugin-vue-jsx'
import type XdmPlugin from 'vite-plugin-xdm'

import type { Router, RouteRecordRaw, RouterOptions as VueRouterOptions } from 'vue-router'
import type { HeadClient } from '@vueuse/head'

export type RouterOptions = PartialKeys<VueRouterOptions, 'history'> & { base?: string }

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

export interface IslandsConfig {
  tempDir: string
  vite: ViteConfig
  vue: Parameters<typeof VuePlugin>[0]
  pages: Parameters<typeof PagesPlugin>[0]
  layouts: Parameters<typeof LayoutsPlugin>[0]
  components: Parameters<typeof ComponentsPlugin>[0]
  vueJsx: Parameters<typeof VueJsxPlugin>[0]
  markdown: Parameters<typeof XdmPlugin>[0]
}

export interface LocaleConfig {
  lang: string
  title?: string
  description?: string
  head?: HeadConfig[]
  label?: string
  selectText?: string
}

export interface SiteData<ThemeConfig = any> {
  base: string
  /**
   * Language of the site as it should be set on the `html` element.
   * @example `en-US`, `zh-CN`
   */
  lang: string
  title: string
  description: string
  head: HeadConfig[]
  themeConfig: ThemeConfig
  locales: Record<string, LocaleConfig>
  /**
   * Available locales for the site when it has defined `locales` in its
   * `themeConfig`. This object is otherwise empty. Keys are paths like `/` or
   * `/zh/`.
   */
  langs: Record<
    string,
    {
      /**
       * Lang attribute as set on the `<html>` element.
       * @example `en-US`, `zh-CN`
       */
      lang: string
      /**
       * Label to display in the language menu.
       * @example `English', `简体中文`
       */
      label: string
    }
  >
}

export type HeadConfig =
  | [string, Record<string, string>]
  | [string, Record<string, string>, string]

export interface PageData {
  relativePath: string
  title: string
  description: string
  headers: Header[]
  frontmatter: Record<string, any>
  lastUpdated: number
}

export interface Header {
  level: number
  title: string
  slug: string
}
