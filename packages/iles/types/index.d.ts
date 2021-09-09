export * from './shared'
export * from '../dist/node/index'
export * from '../dist/client/index'

import type { UserConfig as ViteConfig } from 'vite'

import type VuePlugin from '@vitejs/plugin-vue'
import type PagesPlugin from 'vite-plugin-pages'
import type LayoutsPlugin from 'vite-plugin-vue-layouts'
import type ComponentsPlugin from 'unplugin-vue-components/vite'
import type VueJsxPlugin from '@vitejs/plugin-vue-jsx'
// import type XdmPlugin from 'vite-plugin-xdm'

export interface IslandsConfig {
  tempDir: string
  vite: ViteConfig
  vue: Parameters<typeof VuePlugin>[0]
  pages: Parameters<typeof PagesPlugin>[0]
  layouts: Parameters<typeof LayoutsPlugin>[0]
  components: Parameters<typeof ComponentsPlugin>[0]
  vueJsx: Parameters<typeof VueJsxPlugin>[0]
  // xdm: Parameters<typeof XdmPlugin>[0]
}
