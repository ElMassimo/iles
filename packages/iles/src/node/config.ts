import { existsSync, promises as fs } from 'node:fs'
import { join, resolve } from 'pathe'
import pc from 'picocolors'
import creatDebugger from 'debug'
import type { Plugin, PluginOption } from 'vite'
import { loadConfigFromFile, mergeConfig as mergeViteConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import components from 'unplugin-vue-components/vite'
import pages from '@islands/pages'
import mdx from '@islands/mdx'

import type { ComponentResolverFunction } from 'unplugin-vue-components/types'
import type { UserConfig } from 'iles'

import type {
  AppConfig,
  ConfigEnv,
  IlesModule,
  IlesModuleLike,
  IlesModuleOption,
  NamedPlugins,
  PreactOptions,
  SolidOptions,
  SvelteOptions,
  ViteOptions,
} from './shared'

import { camelCase, compact, importLibrary, isString, isStringPlugin, tryImportOrInstallModule, uncapitalize } from './plugin/utils'
import { DIST_CLIENT_PATH, HYDRATION_DIST_PATH, ISLAND_COMPONENT_PATH, resolveAliases } from './alias'
import remarkWrapIslands from './plugin/remarkWrapIslands'

import { explicitHtmlPath } from './utils'

const debug = creatDebugger('iles:config')

export type { AppConfig }

export const IlesComponentResolver: ComponentResolverFunction = (name) => {
  if (name === 'Island') { return { from: ISLAND_COMPONENT_PATH } }
  if (name === 'Head') { return { name: 'Head', from: '@unhead/vue/components' } }
}

export function IlesLayoutResolver(config: AppConfig): ComponentResolverFunction {
  return (name) => {
    const [layoutName, isLayout] = name.split('Layout', 2)
    if (layoutName && isLayout === '') {
      const layoutFile = join(config.layoutsDir, `${uncapitalize(camelCase(layoutName))}.vue`)
      if (existsSync(layoutFile)) { return { name: 'default', from: layoutFile } }
    }
  }
}

export async function resolveConfig(root?: string, env?: ConfigEnv): Promise<AppConfig> {
  if (!root) { root = process.cwd() }
  if (!env) { env = { mode: 'development', command: 'serve', isSsrBuild: false } }

  const appConfig = await resolveUserConfig(root, env)

  const srcDir = resolve(root, appConfig.srcDir)
  Object.assign(appConfig, {
    srcDir,
    pagesDir: resolve(srcDir, appConfig.pagesDir),
    outDir: resolve(root, appConfig.outDir),
    tempDir: resolve(root, appConfig.tempDir),
    layoutsDir: resolve(srcDir, appConfig.layoutsDir),
  })

  for (const mod of appConfig.modules) { await mod.configResolved?.(appConfig, env) }

  appConfig.vite.define!['import.meta.env.DISPOSE_ISLANDS']
    = env.mode === 'development' || appConfig.turbo

  checkDeprecations(appConfig as any)

  return appConfig
}

async function resolveUserConfig(root: string, configEnv: ConfigEnv) {
  const config = { root } as AppConfig

  const { modules = [], ...userConfig } = await loadUserConfigFile(root, configEnv)

  if ((userConfig as any).plugins) { throw new Error(`îles 'plugins' have been renamed to 'modules'. If you want to provide Vite plugins instead, place them in 'vite:'. Received 'plugins' in ${(userConfig as any).configPath}:\n${JSON.stringify((userConfig as any).plugins)}`) }

  config.modules = compact<IlesModule>(await resolveIlesModules([
    { name: 'iles:base-config', ...appConfigDefaults(config, userConfig as UserConfig, configEnv) },
    mdx(),
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
  if (!config.base.endsWith('/')) { config.base = `${config.base}/` }
  config.vite.base = config.base
  config.vite.build!.assetsDir = config.assetsDir

  return config
}

async function loadUserConfigFile(root: string, configEnv: ConfigEnv): Promise<UserConfig> {
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

async function setNamedPlugins(config: AppConfig, env: ConfigEnv, plugins: NamedPlugins) {
  const ceChecks = config.modules.map(mod => mod.vue?.template?.compilerOptions?.isCustomElement).filter(x => x)
  config.vue.template!.compilerOptions!.isCustomElement = (tagName: string) =>
    tagName.startsWith('ile-') || ceChecks.some(fn => fn!(tagName))

  plugins.components = components(config.components)
  plugins.vue = vue(config.vue)

  const optionalPlugins = {
    async solid(options: SolidOptions) {
      const solid = await importLibrary<typeof import('vite-plugin-solid')['default']>('vite-plugin-solid')
      return solid({ ssr: true, ...options })
    },
    async preact(options: PreactOptions) {
      const preact = await importLibrary<typeof import('@preact/preset-vite')['default']>('@preact/preset-vite')
      return preact(options)
    },
    async svelte(options: SvelteOptions) {
      const { svelte } = await importLibrary<typeof import('@sveltejs/vite-plugin-svelte')>('@sveltejs/vite-plugin-svelte')
      return svelte({ ...options, compilerOptions: { hydratable: true, ...options?.compilerOptions } })
    },
  }
  for (const [optionName, createPlugin] of Object.entries(optionalPlugins)) {
    const addPlugin = config[optionName as keyof AppConfig] || config.jsx === optionName
    if (addPlugin) {
      const options = isObject(addPlugin) ? addPlugin : {}
      config.vitePlugins.push(await createPlugin(options as any) as Plugin)
      if (optionName === 'preact') { await tryImportOrInstallModule('preact-render-to-string') }
    }
  }
}

async function applyModules(config: AppConfig, configEnv: ConfigEnv) {
  for (const mod of config.modules) {
    if ((mod as any).modules && (mod as any).modules.length > 0) { throw new Error(`Modules in îles can't specify the 'modules' option, return an array of modules instead. Found in ${mod.name}: ${JSON.stringify((mod as any).modules)}`) }

    const { name, config: configFn, configResolved: _, ...moduleConfig } = mod

    config = mergeConfig(config, moduleConfig)
    if (configFn) {
      const partialConfig = await configFn(config, configEnv)
      if (partialConfig) { config = mergeConfig(config, partialConfig as any) }
    }
  }
  chainModuleCallbacks(config, ['extendFrontmatter', 'extendRoute', 'extendRoutes'])
  chainModuleCallbacks(config, ['beforePageRender', 'onSiteBundled', 'onSiteRendered'], 'ssg')
  return config
}

async function resolveIlesModules(modules: IlesModuleOption[]): Promise<IlesModuleLike[]> {
  return await Promise.all(modules.map(resolveModule))
}

async function resolveModule(mod: IlesModuleOption): Promise<IlesModuleLike> {
  if (isString(mod)) { return await createIlesModule(mod) }
  if (isStringPlugin(mod)) { return await createIlesModule(...mod) }
  return await mod
}

async function createIlesModule(pkgName: string, ...options: any[]): Promise<IlesModule> {
  const fn = await tryImportOrInstallModule(pkgName)
  return fn(...options)
}

function inferJSX(config: UserConfig) {
  const pluginsNested: PluginOption[] = config.vite?.plugins ?? []
  const plugins: Plugin[] = pluginsNested.flat() as Plugin[]
  for (const plugin of plugins) {
    if (!plugin) { continue }

    const { name = '' } = plugin
    if (name.includes('preact')) { return 'preact' }
    if (name.includes('solid')) { return 'solid' }
  }
}

function appConfigDefaults(appConfig: AppConfig, userConfig: UserConfig, env: ConfigEnv): AppConfig {
  const { root } = appConfig
  const isDevelopment = env.mode === 'development'
  const { drafts = isDevelopment, jsx = inferJSX(userConfig), srcDir = 'src' } = userConfig

  return {
    debug: true,
    drafts,
    turbo: false,
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
    srcDir,
    outDir: 'dist',
    layoutsDir: 'layouts',
    tempDir: '.iles-ssg-temp',
    modules: [] as IlesModule[],
    namedPlugins: {} as NamedPlugins,
    resolvePath: undefined as any,
    vitePlugins: [],
    vite: viteConfigDefaults(root, userConfig),
    vue: {
      template: {
        compilerOptions: {},
      },
    },
    // Adds lastUpdated meta field.
    async extendFrontmatter(frontmatter, filename) {
      frontmatter.meta.lastUpdated
        = (await fs.stat(filename)).mtime
    },
    // Adds handling for explicit HTML urls.
    extendRoute(route) {
      if (appConfig.prettyUrls === false) { route.path = explicitHtmlPath(route.path, route.componentFilename) }
    },
    // Handle 404s in development.
    extendRoutes(routes) {
      if (isDevelopment) { return [...routes, { path: '/:zzz(.*)*', name: 'NotFoundInDev', componentFilename: '@islands/components/NotFound' }] }
      else if (!drafts) { return routes.filter(route => !route.frontmatter?.draft) }
    },
    markdown: {
      jsxRuntime: 'automatic',
      jsxImportSource: 'iles',
      providerImportSource: 'iles',
      rehypePlugins: [],
      remarkPlugins: [
        [remarkWrapIslands, { get config() { return appConfig } }],
      ],
    },
    components: {
      dts: true,
      extensions: ['vue', 'jsx', 'tsx', 'js', 'ts', 'mdx', 'svelte'],
      include: [/\.vue$/, /\.vue\?vue/, /\.mdx?/],
      dirs: `${srcDir}/components`,
      resolvers: [
        IlesComponentResolver,
        IlesLayoutResolver(appConfig),
      ],
      transformer: 'vue3',
    },
  }
}

function viteConfigDefaults(root: string, userConfig: UserConfig): ViteOptions {
  return {
    root,
    resolve: {
      alias: resolveAliases(root, userConfig),
      dedupe: ['vue', 'vue-router', '@unhead/vue', '@vue/devtools-api'],
    },
    server: {
      fs: { allow: [root, DIST_CLIENT_PATH, HYDRATION_DIST_PATH] },
    },
    build: {
      cssCodeSplit: false,
    },
    define: {},
    optimizeDeps: {
      include: [
        'vue',
        'vue-router',
        '@unhead/vue',
        '@vue/devtools-api',
      ],
      exclude: [
        'iles',
        '@nuxt/devalue',
        '@islands/hydration',
        'vue/server-renderer',
      ],
    },
  }
}

function mergeConfig<T = Record<string, any>>(a: T, b: T, isRoot = true): AppConfig {
  const merged: Record<string, any> = { ...a as any }
  for (const key in b) {
    const value = b[key as keyof T]
    if (value == null) { continue }

    const existing = merged[key]
    if (Array.isArray(existing) && Array.isArray(value)) {
      merged[key] = [...existing, ...value]
      continue
    }
    if (isObject(existing) && isObject(value)) {
      if (isRoot && key === 'vite') { merged[key] = mergeViteConfig(existing, value as any) }
      else { merged[key] = mergeConfig(existing, value, false) }

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

function chainCallbacks(fns: any): any {
  return async (...args: any[]) => {
    for (let i = 0; i < fns.length; i++) {
      const result = await (fns[i] as any)(...args)
      if (result) { args[0] = result }
    }
    return args[0]
  }
}

function isObject(value: unknown): value is Record<string, any> {
  return Object.prototype.toString.call(value) === '[object Object]'
}

function checkDeprecations(config: any) {
  if (config.markdown?.extendFrontmatter) { throw new Error('CHANGES REQUIRED: `markdown.extendFrontmatter` is now `extendFrontmatter`') }

  if (config.pages?.extendRoute) { throw new Error('CHANGES REQUIRED: `pages.extendRoute` is now `extendRoute`') }

  if (config.pages?.onRoutesGenerated) { throw new Error('CHANGES REQUIRED: `pages.onRoutesGenerated` is now `extendRoutes`') }

  if (config.pages) { throw new Error('CHANGES REQUIRED: `pages` is no longer an option, see @islands/pages') }
}
