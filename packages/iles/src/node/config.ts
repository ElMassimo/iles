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
import { resolveAliases, DIST_CLIENT_PATH, HYDRATION_DIST_PATH } from './alias'
import remarkWrapIslands from './plugin/remarkWrapIslands'

const debug = creatDebugger('iles:config')

export type { AppConfig }

export const IlesComponentResolver: ComponentResolver = (name) => {
  if (name === 'Island') return { importName: 'Island', path: 'iles' }
  if (name === 'Layout') return { importName: 'Layout', path: 'iles' }
  if (name === 'Head') return { importName: 'Head', path: '@vueuse/head' }
}

export async function resolveConfig (root?: string, env?: ConfigEnv): Promise<AppConfig> {
  if (!root) root = process.cwd()
  if (!env) env = { mode: 'development', command: 'serve' }

  const appConfig = await resolveUserConfig(root, env)

  const srcDir = resolve(root, appConfig.srcDir)

  const config = Object.assign(appConfig, {
    srcDir,
    outDir: resolve(root, appConfig.outDir),
    tempDir: resolve(root, appConfig.tempDir),
    layoutsDir: resolve(srcDir, appConfig.layoutsDir),
  })

  chainPluginCallbacks(config, 'pages', ['onRoutesGenerated', 'onClientGenerated'], true)
  chainPluginCallbacks(config, 'pages', ['extendRoute'], false)
  chainPluginCallbacks(config, 'markdown', ['extendFrontmatter'], false)

  const ceChecks = config.plugins.map(plugin => plugin.vue?.template?.compilerOptions?.isCustomElement).filter(x => x)
  config.vue.template!.compilerOptions!.isCustomElement = (tagName: string) =>
    tagName.startsWith('ile-') || ceChecks.some(fn => fn!(tagName))

  withResolvedConfig(config)
  return config
}

const defaultPlugins = (root: string, plugins: AppConfig['namedPlugins']): Plugin[] => [
  {
    name: 'frontmatter-meta',
    markdown: {
      // Adds meta fields such as filename, lastUpdated, and href.
      extendFrontmatter (frontmatter, absoluteFilename) {
        let resolvedPage = plugins.pages.api.pageForFile(absoluteFilename)
        const normalizedPath = resolvedPage && `/${resolvedPage.route.replace(/(^|\/)index$/, '')}`
        const { route: { path = normalizedPath } = {}, meta: routeMeta, templateAttrs: _t, ...routeMatter }: Frontmatter = resolvedPage?.customBlock || {}
        const meta = {
          lastUpdated: new Date(Math.round(fs.statSync(absoluteFilename).mtimeMs)),
          ...frontmatter.meta,
          ...routeMeta,
          filename: relative(root, absoluteFilename),
        }
        if (path !== undefined) meta.href = path
        return { ...frontmatter, ...routeMatter, meta }
      },
    },
  },
]

async function resolveUserConfig (root: string, configEnv: ConfigEnv) {
  const defaults = appConfigDefaults(root)
  const result = await loadConfigFromFile(configEnv, 'iles.config.ts', root)
  debug(result ? `loaded config at ${yellow(result.path)}` : 'no iles.config.ts file found.')

  let namedPlugins = {} as AppConfig['namedPlugins']
  let { plugins = [], ...config } = result ? mergeConfig(defaults, result.config as any) : defaults
  const userPlugins = [...defaultPlugins(root, namedPlugins), config, ...plugins].flat().filter(p => p) as Plugin[]

  for (const plugin of userPlugins) {
    if (plugin.config) {
      const partialConfig = await plugin.config(config, configEnv)
      if (partialConfig) config = mergeConfig(config, partialConfig as any)
    }
  }

  if (result?.path) config.configPath = result?.path
  const appConfig: AppConfig = { ...config, plugins: userPlugins, namedPlugins }
  namedPlugins.pages = pages(appConfig.pages)
  namedPlugins.markdown = xdm(appConfig.markdown)

  appConfig.base = appConfig.siteUrl ? new URL(appConfig.siteUrl).pathname : '/'
  appConfig.vite.base = appConfig.base
  appConfig.vite.build!.assetsDir = appConfig.assetsDir

  return appConfig
}

function appConfigDefaults (root: string): Omit<AppConfig, 'namedPlugins'> {
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
      remarkPlugins: [],
    },
    components: {
      dts: true,
      extensions: ['vue', 'jsx', 'js', 'ts', 'mdx'],
      include: [/\.vue$/, /\.vue\?vue/, /\.mdx?/],
      resolvers: [IlesComponentResolver],
    },
  }
}

// Internal: Once all plugins are resolved, we can ensure frontmatter extensions
// are also applied to routes, providing a consistent experience when importing
// a page or using route meta.
function withResolvedConfig (config: AppConfig) {
  config.markdown.remarkPlugins!.unshift(...[
    remarkWrapIslands,
    import('remark-frontmatter').then(mod => mod.default),
    frontmatterPlugin(config),
  ])
  // NOTE: Adds filename to the meta information in the route so that it can be
  // used to correctly infer the file name.
  const { extendRoute } = config.pages
  config.pages.extendRoute = (route, parent) => {
    route = extendRoute?.(route, parent) || route
    const filename = join(config.root, route.component)
    return { ...route, meta: { ...route.meta, filename } }
  }
}

async function frontmatterPlugin (config: AppConfig): Promise<FrontmatterPluggable> {
  const { remarkFrontmatter } = await import('@islands/frontmatter')
  const { extendFrontmatter } = config.markdown
  return [remarkFrontmatter, { extendFrontmatter }]
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
        '@islands/layouts',
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
