/* eslint-disable no-restricted-syntax */
import fs from 'fs'
import { join, resolve } from 'pathe'
import pc from 'picocolors'
import creatDebugger from 'debug'
import { loadConfigFromFile, mergeConfig as mergeViteConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import components from 'unplugin-vue-components/vite'
import pages from '@islands/pages'
import vueMdx from '@islands/mdx'

import type { ComponentResolver } from 'unplugin-vue-components/types'
import type { UserConfig } from 'iles'

import { importModule } from 'lib/modules'
import type { AppConfig, ConfigEnv, ViteOptions, IlesModule, IlesModuleLike, IlesModuleOption, NamedPlugins } from './shared'

import { camelCase, tryInstallModule, importLibrary, uncapitalize, isString, isStringPlugin, compact } from './plugin/utils'
import { resolveAliases, DIST_CLIENT_PATH, HYDRATION_DIST_PATH } from './alias'
import remarkWrapIslands from './plugin/remarkWrapIslands'

import { explicitHtmlPath } from './utils'

const debug = creatDebugger('iles:config')

export type { AppConfig }

const IlesComponentResolver: ComponentResolver = (name) => {
  if (name === 'Island') return { importName: 'Island', path: 'iles' }
  if (name === 'Head') return { importName: 'Head', path: '@vueuse/head' }
}

export async function resolveConfig (root?: string, env?: ConfigEnv): Promise<AppConfig> {
  if (!root) root = process.cwd()
  if (!env) env = { mode: 'development', command: 'serve' }

  const appConfig = await resolveUserConfig(root, env)

  const srcDir = resolve(root, appConfig.srcDir)
  Object.assign(appConfig, {
    srcDir,
    pagesDir: resolve(srcDir, appConfig.pagesDir),
    outDir: resolve(root, appConfig.outDir),
    tempDir: resolve(root, appConfig.tempDir),
    layoutsDir: resolve(srcDir, appConfig.layoutsDir),
  })

  for (const mod of appConfig.modules)
    await mod.configResolved?.(appConfig, env)

  return appConfig
}

async function resolveUserConfig (root: string, configEnv: ConfigEnv) {
  const config = { root } as AppConfig

  const { modules = [], ...userConfig } = await loadUserConfigFile(root, configEnv)

  if ((userConfig as any).plugins)
    throw new Error(`îles 'plugins' have been renamed to 'modules'. If you want to provide Vite plugins instead, place them in 'vite:'. Received 'plugins' in ${(userConfig as any).configPath}:\n${JSON.stringify((userConfig as any).plugins)}`)

  config.modules = compact<IlesModule>(await resolveIlesModules([
    { name: 'iles:base-config', ...appConfigDefaults(config, userConfig as UserConfig) },
    vueMdx(),
    { name: 'user-config', ...userConfig },
    ...modules,
    pages(),
  ]).then(modules => modules.flat()))

  Object.assign(config, await applyModules(config, configEnv))
  await setNamedPlugins(config, configEnv, config.namedPlugins)

  const siteUrl = config.siteUrl || ''
  const protocolIndex = siteUrl.indexOf('//')
  const baseIndex = siteUrl.indexOf('/', protocolIndex > -1 ? protocolIndex + 2 : 0)
  config.siteUrl = baseIndex > -1 ? siteUrl.slice(0, baseIndex) : siteUrl
  config.base = baseIndex > -1 ? siteUrl.slice(baseIndex) : '/'
  if (!config.base.endsWith('/')) config.base = `${config.base}/`
  config.vite.base = config.base
  config.vite.build!.assetsDir = config.assetsDir

  return config
}

async function loadUserConfigFile (root: string, configEnv: ConfigEnv): Promise<UserConfig> {
  try {
    const { path, config = {} }
      = await loadConfigFromFile(configEnv, 'iles.config.ts', root) || {}
    if (path && config) {
      (config! as AppConfig).configPath = path
      debug(`loaded config at ${pc.yellow(path)}`)
    }
    else {
      debug('no iles.config.ts file found.')
    }
    return config as UserConfig
  }
  catch (error) {
    if (error.message.includes('Could not resolve')) {
      debug('no iles.config.ts file found.')
      return {}
    }
    throw error
  }
}

async function setNamedPlugins (config: AppConfig, env: ConfigEnv, plugins: NamedPlugins) {
  const ceChecks = config.modules.map(mod => mod.vue?.template?.compilerOptions?.isCustomElement).filter(x => x)
  config.vue.template!.compilerOptions!.isCustomElement = (tagName: string) =>
    tagName.startsWith('ile-') || ceChecks.some(fn => fn!(tagName))

  plugins.components = components(config.components)
  plugins.vue = vue(config.vue)

  const optionalPlugins: [keyof AppConfig, string, (mod: any, options: any) => any][] = [
    ['solid', 'vite-plugin-solid', (mod, options) => mod({ ssr: true, ...options })],
    ['preact', '@preact/preset-vite', (mod, options) => mod(options)],
    ['svelte', '@sveltejs/vite-plugin-svelte', (mod, options) =>
      mod.svelte({ ...options, compilerOptions: { hydratable: true, ...options?.compilerOptions } }),
    ],
  ]
  for (const [optionName, pluginName, createPlugin] of optionalPlugins) {
    const addPlugin = config[optionName] || config.jsx === optionName
    if (addPlugin) {
      const options = isObject(addPlugin) ? addPlugin : {}
      config.vitePlugins.push(createPlugin(await importLibrary(pluginName), options))
      if (optionName === 'preact')
        await tryInstallModule('preact-render-to-string')
    }
  }
}

async function applyModules (config: AppConfig, configEnv: ConfigEnv) {
  for (const mod of config.modules) {
    if ((mod as any).modules && (mod as any).modules.length > 0)
      throw new Error(`Modules in îles can't specify the 'modules' option, return an array of modules instead. Found in ${mod.name}: ${JSON.stringify((mod as any).modules)}`)

    const { name, config: configFn, configResolved: _, ...moduleConfig } = mod

    config = mergeConfig(config, moduleConfig)
    if (configFn) {
      const partialConfig = await configFn(config, configEnv)
      if (partialConfig) config = mergeConfig(config, partialConfig as any)
    }
  }
  chainModuleCallbacks(config, ['extendFrontmatter', 'extendRoute', 'extendRoutes'])
  chainModuleCallbacks(config, ['beforePageRender', 'onSiteRendered'], 'ssg')
  return config
}

async function resolveIlesModules (modules: IlesModuleOption[]): Promise<IlesModuleLike[]> {
  return await Promise.all(modules.map(resolveModule))
}

async function resolveModule (mod: IlesModuleOption): Promise<IlesModuleLike> {
  if (isString(mod)) return await createIlesModule(mod)
  if (isStringPlugin(mod)) return await createIlesModule(...mod)
  return await mod
}

async function createIlesModule (pkgName: string, ...options: any[]): Promise<IlesModule> {
  await tryInstallModule(pkgName)
  const fn = await importModule(pkgName)
  return fn(...options)
}

function inferJSX (config: UserConfig) {
  const plugins = config.vite?.plugins?.flat() || []
  for (const plugin of plugins) {
    const { name = '' } = plugin || {}
    if (name.includes('preact')) return 'preact'
    if (name.includes('solid')) return 'solid'
  }
}

function appConfigDefaults (appConfig: AppConfig, userConfig: UserConfig): AppConfig {
  const { root } = appConfig
  const { jsx = inferJSX(userConfig) } = userConfig

  function IlesLayoutResolver (name: string) {
    const [layoutName, isLayout] = name.split('Layout', 2)
    if (isLayout === '') {
      const layoutFile = `${uncapitalize(camelCase(layoutName))}.vue`
      return { importName: 'default', path: join(appConfig.layoutsDir, layoutFile) }
    }
  }

  return {
    debug: true,
    jsx,
    root,
    base: '/',
    siteUrl: '',
    prettyUrls: true,
    ssg: {
      sitemap: true,
    },
    configPath: resolve(root, 'iles.config.ts'),
    assetsDir: 'assets',
    pagesDir: 'pages',
    srcDir: 'src',
    outDir: 'dist',
    layoutsDir: 'layouts',
    tempDir: '.iles-ssg-temp',
    modules: [] as IlesModule[],
    namedPlugins: {} as NamedPlugins,
    resolvePath: undefined as any,
    vitePlugins: [],
    vite: viteConfigDefaults(root),
    vue: {
      refTransform: true,
      template: {
        compilerOptions: {},
      },
    },
    // Adds lastUpdated meta field.
    extendFrontmatter (frontmatter, filename) {
      frontmatter.meta.lastUpdated
        = new Date(Math.round(fs.statSync(filename).mtimeMs))
    },
    // Adds handling for explicit HTML urls.
    extendRoute (route) {
      if (appConfig.prettyUrls === false)
        route.path = explicitHtmlPath(route.path, route.componentFilename)
    },
    markdown: {
      jsxRuntime: 'automatic',
      jsxImportSource: 'iles',
      providerImportSource: 'iles',
      remarkPlugins: [
        [remarkWrapIslands, { get config () { return appConfig } }],
      ],
    },
    components: {
      dts: true,
      extensions: ['vue', 'jsx', 'tsx', 'js', 'ts', 'mdx', 'svelte'],
      include: [/\.vue$/, /\.vue\?vue/, /\.mdx?/],
      resolvers: [
        IlesComponentResolver,
        IlesLayoutResolver,
      ],
      transformer: 'vue3',
    },
  }
}

function viteConfigDefaults (root: string): ViteOptions {
  return {
    root,
    resolve: {
      alias: resolveAliases(root),
      dedupe: ['vue', 'vue-router', '@vueuse/head', '@vue/devtools-api'],
    },
    server: {
      fs: { allow: [root, DIST_CLIENT_PATH, HYDRATION_DIST_PATH] },
    },
    build: {
      brotliSize: false,
      cssCodeSplit: false,
    },
    optimizeDeps: {
      include: [
        'vue',
        '@vue/devtools-api',
      ],
      exclude: [
        'iles',
        'vue-router',
        '@nuxt/devalue',
        '@vue/server-renderer',
        '@vueuse/head',
        '@islands/hydration',
      ],
    },
  }
}

function mergeConfig<T = Record<string, any>> (a: T, b: T, isRoot = true): AppConfig {
  const merged: Record<string, any> = { ...a }
  for (const key in b) {
    const value = b[key as keyof T]
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
        merged[key] = mergeConfig(existing, value, false)

      continue
    }
    merged[key] = value
  }
  return merged as AppConfig
}

function chainModuleCallbacks(config: any, callbackNames: string[], option?: string): any {
  callbackNames.forEach((callbackName) => {
    const moduleCallbacks = config.modules
      .map((plugin: any) => (option ? plugin[option] : plugin)?.[callbackName])
      .filter((x: any) => x)

    if (moduleCallbacks.length > 0) {
      const original = option ? config[option] : config
      original[callbackName] = chainCallbacks(moduleCallbacks)
    }
  })
}

function chainCallbacks (fns: any): any {
  return async (...args: any[]) => {
    for (let i = 0; i < fns.length; i++) {
      const result = await (fns[i] as any)(...args)
      if (result) args[0] = result
    }
    return args[0]
  }
}

function isObject (value: unknown): value is Record<string, any> {
  return Object.prototype.toString.call(value) === '[object Object]'
}
