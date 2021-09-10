/* eslint-disable no-restricted-syntax */
import { resolve } from 'path'
import chalk from 'chalk'
import creatDebugger from 'debug'
import { loadConfigFromFile, mergeConfig as mergeViteConfig } from 'vite'
import type { ConfigEnv } from 'vite'
import { UserConfig, Plugin } from '../../types/shared'
import { AppConfig } from './shared'
import { APP_PATH } from './alias'

const debug = creatDebugger('iles:config')

export async function resolveConfig (root: string, env: ConfigEnv): Promise<AppConfig> {
  if (!root) root = process.cwd()
  const userConfig = await resolveUserConfig(root, env) as ReturnType<typeof appConfigDefaults> & UserConfig

  const srcDir = resolve(root, userConfig.srcDir)

  return Object.assign(userConfig, {
    root,
    srcDir,
    outDir: resolve(root, userConfig.outDir),
    layoutsDir: resolve(srcDir, userConfig.layoutsDir),
    pagesDir: resolve(srcDir, userConfig.pagesDir),
  })
}

function appConfigDefaults (root: string) {
  return {
    title: 'îles',
    description: 'Partial hydration in Vue and Vite.js',
    base: '/',
    srcDir: 'src',
    outDir: 'dist',
    layoutsDir: 'layouts',
    pagesDir: 'pages',
    tempDir: resolve(APP_PATH, 'temp'),
    plugins: [],
  }
}

export async function resolveUserConfig (root: string, configEnv: ConfigEnv): Promise<UserConfig> {
  const defaults = appConfigDefaults(root) as UserConfig
  const result = await loadConfigFromFile(configEnv, 'iles.config.ts', root)
  debug(result ? `loaded config at ${chalk.yellow(result.path)}` : 'no iles.config.ts file found.')

  let config = { ...defaults, ...result?.config as UserConfig }
  const userPlugins = (config.plugins || []).flat().filter(p => p) as Plugin[]
  for (const plugin of userPlugins) {
    if (plugin.config) {
      const partialConfig = await plugin.config(config, configEnv)
      if (partialConfig) config = mergeConfig(config, partialConfig)
    }
  }
  return config
}

function mergeConfig (a: UserConfig, b: UserConfig, isRoot = true) {
  const merged: Record<string, any> = { ...a }
  for (const key in b) {
    const value = b[key as keyof UserConfig]
    if (value == null)
      continue

    const existing = merged[key]
    if (Array.isArray(existing) && Array.isArray(value)) {
      merged[key] = [...existing, ...value]
      continue
    }
    if (isObject(existing) && isObject(value)) {
      if (isRoot && key === 'vite')
        merged[key] = mergeViteConfig(existing, value)
      else
        merged[key] = mergeConfig(existing, value as any, false)

      continue
    }
    merged[key] = value
  }
  return merged
}

function isObject (value: unknown): value is Record<string, any> {
  return Object.prototype.toString.call(value) === '[object Object]'
}
