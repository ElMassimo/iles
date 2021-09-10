/* eslint-disable no-use-before-define */
import path, { resolve } from 'path'
import fs from 'fs-extra'
import chalk from 'chalk'
import creatDebugger from 'debug'
import {
  AliasOptions,
  UserConfig as ViteConfig,
  mergeConfig as mergeViteConfig
} from 'vite'
import { Options as VuePluginOptions } from '@vitejs/plugin-vue'
import {
  HeadConfig,
  LocaleConfig,
} from './shared'
import { resolveAliases, APP_PATH } from './alias'
import { PluginOptions as MarkdownOptions } from 'vite-plugin-xdm'

export { resolveSiteDataByRoute } from './shared'

const debug = creatDebugger('iles:config')

export interface UserConfig<ThemeConfig = any> {
  lang?: string
  base?: string
  title?: string
  description?: string
  head?: HeadConfig
  themeConfig?: ThemeConfig
  locales?: Record<string, LocaleConfig>
  markdown?: MarkdownOptions
  /**
   * Opitons to pass on to @vitejs/plugin-vue
   */
  vue?: VuePluginOptions
  /**
   * Vite config
   */
  vite?: ViteConfig

  srcDir?: string
  srcExclude?: string[]

  /**
   * @deprecated use `srcExclude` instead
   */
  exclude?: string[]
  /**
   * @deprecated use `vue` instead
   */
  vueOptions?: VuePluginOptions

  extends?: RawConfigExports
}

type RawConfigExports =
  | UserConfig
  | Promise<UserConfig>
  | (() => UserConfig | Promise<UserConfig>)

export interface SiteConfig<ThemeConfig = any> {
  root: string
  srcDir: string
  configPath: string
  outDir: string
  tempDir: string
  alias: AliasOptions
  markdown: MarkdownOptions | undefined
  vue: VuePluginOptions | undefined
  vite: ViteConfig | undefined
}

export async function resolveConfig(root: string = process.cwd()): Promise<SiteConfig> {
  const userConfig = await resolveUserConfig(root)

  if (userConfig.vueOptions) {
    console.warn(
      chalk.yellow(`[vitepress] "vueOptions" option has been renamed to "vue".`)
    )
  }
  if (userConfig.exclude) {
    console.warn(
      chalk.yellow(
        `[vitepress] "exclude" option has been renamed to "ssrExclude".`
      )
    )
  }

  const srcDir = path.resolve(root, userConfig.srcDir || '.')

  const config: SiteConfig = {
    root,
    srcDir,
    configPath: resolve(root, 'config.js'),
    outDir: resolve(root, 'dist'),
    tempDir: path.resolve(APP_PATH, 'temp'),
    markdown: userConfig.markdown,
    alias: resolveAliases(root),
    vue: userConfig.vue,
    vite: userConfig.vite,
  }

  return config
}

export async function resolveUserConfig(root: string): Promise<UserConfig> {
  // load user config
  const configPath = resolve(root, 'config.js')
  const hasUserConfig = await fs.pathExists(configPath)
  // always delete cache first before loading config
  delete require.cache[configPath]
  const userConfig: RawConfigExports = hasUserConfig ? require(configPath) : {}
  debug(hasUserConfig ? `loaded config at ${chalk.yellow(configPath)}` : `no config file found.`)
  return resolveConfigExtends(userConfig)
}

async function resolveConfigExtends(
  config: RawConfigExports
): Promise<UserConfig> {
  const resolved = await (typeof config === 'function' ? config() : config)
  if (resolved.extends) {
    const base = await resolveConfigExtends(resolved.extends)
    return mergeConfig(base, resolved)
  }
  return resolved
}

function mergeConfig(a: UserConfig, b: UserConfig, isRoot = true) {
  const merged: Record<string, any> = { ...a }
  for (const key in b) {
    const value = b[key as keyof UserConfig]
    if (value == null) {
      continue
    }
    const existing = merged[key]
    if (Array.isArray(existing) && Array.isArray(value)) {
      merged[key] = [...existing, ...value]
      continue
    }
    if (isObject(existing) && isObject(value)) {
      if (isRoot && key === 'vite') {
        merged[key] = mergeViteConfig(existing, value)
      } else {
        merged[key] = mergeConfig(existing, value, false)
      }
      continue
    }
    merged[key] = value
  }
  return merged
}

function isObject(value: unknown): value is Record<string, any> {
  return Object.prototype.toString.call(value) === '[object Object]'
}
