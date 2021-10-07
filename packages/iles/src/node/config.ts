/* eslint-disable no-restricted-syntax */
import fs from 'fs'
import { join, relative, resolve } from 'path'
import { yellow } from 'nanocolors'
import creatDebugger from 'debug'
import { loadConfigFromFile, mergeConfig as mergeViteConfig } from 'vite'
import pages from 'vite-plugin-pages'
import xdm from 'vite-plugin-xdm'

import type { ComponentResolver } from 'unplugin-vue-components/types'
import type { Frontmatter, FrontmatterPluggable } from '@islands/frontmatter'
import type { AppConfig, AppPlugins, ConfigEnv, ViteOptions, Plugin } from './shared'
import { camelCase, uncapitalize } from './plugin/utils'
import { resolveAliases, DIST_CLIENT_PATH, HYDRATION_DIST_PATH } from './alias'
import remarkWrapIslands from './plugin/remarkWrapIslands'

const debug = creatDebugger('iles:config')

export type { AppConfig }

export const IlesComponentResolver: ComponentResolver = (name) => {
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

  const ceChecks = appConfig.plugins.map(plugin => plugin.vue?.template?.compilerOptions?.isCustomElement).filter(x => x)
  appConfig.vue.template!.compilerOptions!.isCustomElement = (tagName: string) =>
    tagName.startsWith('ile-') || ceChecks.some(fn => fn!(tagName))

  return appConfig
}

async function resolveUserConfig (root: string, configEnv: ConfigEnv) {
  const config = { root, namedPlugins: {} } as AppConfig

  const { path, config: { plugins = [], ...userConfig } = {} }
    = await loadConfigFromFile(configEnv, 'iles.config.ts', root) || {}
  if (path) config.configPath = path
  debug(path ? `loaded config at ${yellow(path)}` : 'no iles.config.ts file found.')

  config.plugins = [
    appConfigDefaults(config),
    userConfig,
    ...plugins,
  ].flat().filter(p => p) as Plugin[]

  Object.assign(config, await applyPlugins(config, configEnv))
  config.pages.pagesDir = join(config.srcDir, config.pagesDir)
  config.namedPlugins.pages = pages(config.pages)
  config.namedPlugins.markdown = xdm(config.markdown)

  config.base = config.siteUrl ? new URL(config.siteUrl).pathname : '/'
  config.vite.base = config.base
  config.vite.build!.assetsDir = config.assetsDir

  return config
}

async function applyPlugins (config: AppConfig, configEnv: ConfigEnv) {
  for (const plugin of config.plugins) {
    // @ts-ignore
    const { name, config: configFn, plugins, ...pluginOptions } = plugin
    if (plugins && plugins.length > 0) throw new Error(`Plugins in îles can't specify the 'plugins' option. Found in ${name}: ${JSON.stringify(pluginOptions)}`)

    config = mergeConfig(config, pluginOptions)
    if (configFn) {
      const partialConfig = await configFn(config, configEnv)
      if (partialConfig) config = mergeConfig(config, partialConfig as any)
    }
  }
  chainPluginCallbacks(config, 'pages', ['onRoutesGenerated', 'onClientGenerated'], true)
  chainPluginCallbacks(config, 'pages', ['extendRoute'], false)
  chainPluginCallbacks(config, 'markdown', ['extendFrontmatter'], false)
  return config
}

function appConfigDefaults (appConfig: AppConfig): Omit<AppConfig, 'namedPlugins'> {
  const { root } = appConfig

  function IlesLayoutResolver (name: string) {
    const [layoutName, isLayout] = name.split('Layout', 2)
    if (isLayout === '') {
      const layoutFile = `${uncapitalize(camelCase(layoutName))}.vue`
      return { importName: 'default', path: join(appConfig.layoutsDir, layoutFile) }
    }
  }

  return {
    debug: true,
    root,
    base: '/',
    siteUrl: '',
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
    plugins: [] as Plugin[],
    router: {},
    pages: {
      routeBlockLang: 'yaml',
      syncIndex: false,
      extensions: ['vue', 'md', 'mdx'],
      // NOTE: Adds filename to the meta information in the route so that it can
      // be used to correctly infer the file name during SSG.
      extendRoute (route) {
        const filename = join(root, route.component)
        return { ...route, meta: { ...route.meta, filename } }
      },
    },
    vite: viteConfigDefaults(root),
    vue: {
      refTransform: true,
      template: {
        compilerOptions: {},
      },
    },
    vueJsx: {
      include: /\.[jt]sx|mdx?$/,
    },
    markdown: {
      jsx: true,
      remarkPlugins: [
        remarkWrapIslands,
        import('remark-frontmatter').then(mod => mod.default),
        frontmatterPlugin(appConfig),
      ],
      // Adds meta fields such as filename, lastUpdated, and href.
      extendFrontmatter (frontmatter, absoluteFilename) {
        let resolvedPage = appConfig.namedPlugins.pages.api.pageForFile(absoluteFilename)
        const normalizedPath = resolvedPage && `/${resolvedPage.route.replace(/(^|\/)index$/, '')}`
        const { route: { path = normalizedPath } = {}, meta: routeMeta, templateAttrs: _t, ...routeMatter }: Frontmatter = resolvedPage?.customBlock || {}
        const meta = {
          lastUpdated: new Date(Math.round(fs.statSync(absoluteFilename).mtimeMs)),
          ...frontmatter.meta,
          ...routeMeta,
          filename: relative(root, absoluteFilename),
        }
        if (path !== undefined) meta.href = `${appConfig.base}${path.slice(1)}`
        return { ...frontmatter, ...routeMatter, meta }
      },
    },
    components: {
      dts: true,
      extensions: ['vue', 'jsx', 'js', 'ts', 'mdx'],
      include: [/\.vue$/, /\.vue\?vue/, /\.mdx?/],
      resolvers: [
        IlesComponentResolver,
        IlesLayoutResolver,
      ],
    },
  }
}

async function frontmatterPlugin (config: AppConfig): Promise<FrontmatterPluggable> {
  const { remarkFrontmatter } = await import('@islands/frontmatter')
  return [remarkFrontmatter, {
    get extendFrontmatter () {
      return config.markdown.extendFrontmatter
    },
  }]
}

function viteConfigDefaults (root: string): ViteOptions {
  return {
    root,
    resolve: {
      alias: resolveAliases(root),
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

function chainPluginCallbacks<T extends keyof AppPlugins> (
  config: AppConfig, option: T, callbackNames: (keyof AppPlugins[T])[], isAsync: boolean) {
  callbackNames.forEach((callbackName) => {
    const pluginCallbacks = config.plugins
      .map(plugin => plugin[option]?.[callbackName as keyof Plugin[T]])
      .filter(x => x)

    if (pluginCallbacks.length > 0)
      config[option][callbackName] = chainCallbacks(pluginCallbacks, isAsync) as any
  })
}

function chainCallbacks (fns: any, isAsync: boolean): Function {
  if (isAsync) {
    return async (...args: any[]) => {
      for (let i = 0; i < fns.length; i++) {
        const result = await (fns[i] as any)(...args)
        if (result) args[0] = result
      }
      return args[0]
    }
  }
  else {
    return (...args: any[]) => {
      for (let i = 0; i < fns.length; i++) {
        const result = (fns[i] as any)(...args)
        if (result) args[0] = result
      }
      return args[0]
    }
  }
}

function isObject (value: unknown): value is Record<string, any> {
  return Object.prototype.toString.call(value) === '[object Object]'
}
