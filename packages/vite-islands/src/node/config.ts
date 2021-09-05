import path from 'path'
import chalk from 'chalk'
import { promises as fs } from 'fs'

import { resolveConfig as resolveViteConfig } from 'vite'
import type { InlineConfig } from 'vite'

export interface IslandsConfig {
  tempDir: string
  vite: ViteConfig
  vue: VuePluginOptions
  vue: Parameters<import('@vitejs/plugin-vue')>[0]
  pages: Parameters<import('vite-plugin-pages')>[0]
  layouts: Parameters<import('vite-plugin-vue-layouts')>[0]
  components: Parameters<import('unplugin-vue-components/vite')>[0]
  vueJSX: Parameters<import('@vitejs/plugin-vue-jsx')>[0]
  xDM: Parameters<import('vite-plugin-xdm')>[0]
}

const resolve = (root: string, file: string) =>
  path.resolve(root, `.vitepress`, file)

  inlineConfig: InlineConfig,
  command: 'build' | 'serve',
  defaultMode = 'development'
export async function resolveConfig (options: InlineConfig) {
  const config = await resolveViteConfig({}, 'build', mode)

  return config
}
