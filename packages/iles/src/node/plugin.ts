import path from 'path'
import fs from 'fs'
import { build as viteBuild } from 'vite'
import type { Manifest, PluginOption, ResolvedConfig, ResolveFn, UserConfig } from 'vite'
import type { ViteSSGOptions } from '@mussi/vite-ssg'

import Vue from '@vitejs/plugin-vue'
import Pages from 'vite-plugin-pages'
import Layouts from 'vite-plugin-vue-layouts'
import IconsResolver from 'unplugin-icons/resolver'
import ViteComponents from 'unplugin-vue-components/vite'
import VueJSX from '@vitejs/plugin-vue-jsx'
import XDM from 'vite-plugin-xdm'

import matter from 'gray-matter'
import glob from 'fast-glob'
import chalk from 'chalk'
import createDebugger from 'debug'
import { escapeRegex, pascalCase, serialize } from './string'
import type { IslandsConfig } from './shared'
import { uniq } from './array'
import { parseImports, rebaseImports } from './parse'

import { resolveAliases, APP_PATH, DIST_CLIENT_PATH, SITE_DATA_REQUEST_PATH, ROUTES_REQUEST_PATH, USER_CONFIG_REQUEST_PATH } from './alias'

const debug = {
  mdx: createDebugger('islands:mdx'),
  wrap: createDebugger('islands:wrap'),
  resolve: createDebugger('islands:resolve'),
  build: createDebugger('islands:build'),
}

function resolveManifestEntries (manifest: Manifest, entryNames: string[]): string[] {
  return entryNames.flatMap((entryName) => {
    const entry = manifest[entryName]
    return [entry.file, ...resolveManifestEntries(manifest, entry.imports || [])]
  })
}

function stringifyPreload (manifest: Manifest, hrefs: string[]) {
  return uniq(resolveManifestEntries(manifest, hrefs))
    .map(href => `<link rel="modulepreload" href="${path.join(base, href)}" crossorigin/>`)
    .join('')
}

function parseId (id: string) {
  const index = id.indexOf('?')
  if (index < 0) {
    return { path: id, query: {} }
  }
  else {
    // @ts-ignore
    const query = Object.fromEntries(new URLSearchParams(id.slice(index)))
    return {
      path: id.slice(0, index),
      query,
    }
  }
}

function filenameFromRoute (route: string) {
  const relativeRoute = (route.endsWith('/') ? `${route}index` : route).replace(/^\//g, '')
  const filename = `${relativeRoute}.html`
  return path.join(outDir, filename)
}

function buildLog (text: string, count: number | undefined) {
  console.log(`
${chalk.gray('[islands]')} ${chalk.yellow(text)}${count ? chalk.blue(` (${count})`) : ''}`)
}

async function replaceAsync (str: string, regex: RegExp, asyncFn: (...groups: string[]) => Promise<string>) {
  const promises = Array.from(str.matchAll(regex))
    .map(([match, ...args]) => asyncFn(match, ...args))
  const replacements = await Promise.all(promises)
  return str.replace(regex, () => replacements.shift()!)
}

let base: ResolvedConfig['base']
let assetsDir: ResolvedConfig['build']['assetsDir']
let outDir: ResolvedConfig['build']['outDir']
let logger: ResolvedConfig['logger']
let mode: ResolvedConfig['mode']
let root: ResolvedConfig['root']
let resolveVitePath: ResolveFn
let islandsConfig: IslandsConfig

const hydrationBegin = '<!--VITE_ISLAND_HYDRATION_BEGIN-->'
const hydrationEnd = '<!--VITE_ISLAND_HYDRATION_END-->'
const slotBegin = '<!--VITE_ISLAND_SLOT_BEGIN-->'
const slotSeparator = 'VITE_ISLAND_SLOT_SEPARATOR'
const commentsRegex = /<!--\[-->|<!--]-->/g
const hydrationRegex = new RegExp(`${escapeRegex(hydrationBegin)}(.*?)${escapeRegex(hydrationEnd)}`, 'sg')
const contextComponentRegex = new RegExp(escapeRegex('_ctx.__unplugin_components_'), 'g')
const unresolvedIslandKey = '__viteIslandComponent'
const viteIslandRegex = new RegExp(`"?${escapeRegex(unresolvedIslandKey)}"?:\\s*([^,]+),`, 'sg')
const scriptTagsRegex = /<script\s*([^>]*?)>(.*?)<\/script>/sg

const islandsByRoute: Record<string, string[]> = Object.create(null)

function config (config: UserConfig) {
  return {
    resolve: {
      alias: resolveAliases(config.root ?? process.cwd()),
    },
    server: {
      fs: {
        allow: [DIST_CLIENT_PATH, config.root ?? process.cwd()],
      },
    },
    build: {
      brotliSize: false,
      minify: false,
      ...config.build,
    },
    optimizeDeps: {
      include: [
        'vue',
        'vue-router',
        '@vueuse/core',
        '@vueuse/head',
        '@nuxt/devalue',
      ],
      exclude: [
        'vue-demi',
        'vue-islands',
      ],
    },
    islands: {
      tempDir: path.join(config.root || process.cwd(), '.vite-islands-temp'),
    },
    ssgOptions: {
      async onPageRendered (route, html) {
        let counter = 0
        const pageIslands: string[] = []
        const assetsBase = path.join(base, assetsDir)
        const pageOutDir = path.resolve(islandsConfig.tempDir, route === '/' ? 'index' : route.replace(/^\//, '').replace(/\//g, '-'))
        fs.mkdirSync(pageOutDir, { recursive: true })
        html = html.replace(scriptTagsRegex, (script: string, attrs: string) => {
          return !attrs.includes('client-keep') && attrs.includes('type="module"') && attrs.includes(`src="${assetsBase}`)
            ? ''
            : script
        })
        html = html.replace(/<link\s*([^>]*?)>/sg, (link: string, attrs: string) => {
          if (attrs.includes('modulepreload') && attrs.includes('.js')) return ''
          return link
        })
        html = await replaceAsync(html, hydrationRegex, async (str, slotsContent) => {
          const basename = `vite-island-${++counter}.js`
          const filename = path.join(pageOutDir, basename)
          const [scriptTemplate, ...slotStrs] = slotsContent.replace(commentsRegex, '').split(slotBegin)
          const slots = Object.fromEntries(slotStrs.map(str => str.split(slotSeparator)))
          const script = scriptTemplate.replace('/* VITE_ISLAND_HYDRATION_SLOTS */', slotStrs.length ? serialize(slots) : '')
          await fs.promises.writeFile(filename, script, 'utf-8')
          pageIslands.push(filename)
          return `${hydrationBegin}${filename}${hydrationEnd}`
        })
        if (pageIslands.length) {
          islandsByRoute[route] = pageIslands
          logger.warn(`${chalk.dim(`${path.relative(islandsConfig.tempDir, pageOutDir)}`)} ${chalk.green(` (${pageIslands.length})`)}`)
        }
        else {
          logger.warn(`${chalk.dim(`${path.relative(islandsConfig.tempDir, pageOutDir)}`)} ${chalk.yellow(' no islands')}`)
        }
        return html
      },
      async onFinished () {
        const islandFiles = Object.values(islandsByRoute).flat()
        if (islandFiles.length === 0) return

        buildLog('Build for islands...', islandFiles.length)

        const assetsBase = path.join(base, assetsDir)

        // Remove unnecessary client scripts.
        const files = await glob(path.join(outDir, '**/*.js'))
        files.forEach(fileName => fs.promises.rm(fileName))

        await viteBuild({
          publicDir: false,
          build: {
            minify: 'esbuild',
            brotliSize: true,
            emptyOutDir: false,
            manifest: true,
            outDir,
            rollupOptions: {
              input: islandFiles,
            },
          },
          mode,
        })
        const manifest: Manifest = JSON.parse(fs.readFileSync(path.join(outDir, 'manifest.json'), 'utf-8'))

        await Promise.all(Object.keys(islandsByRoute).map(async (route) => {
          const htmlFilename = filenameFromRoute(route)

          let html = await fs.promises.readFile(htmlFilename, 'utf-8')
          const preloadScripts: string[] = []
          html = await replaceAsync(html, hydrationRegex, async (str, file) => {
            const entry = manifest[path.relative(root, file)]
            if (entry.imports) preloadScripts.push(...entry.imports)

            const filename = path.join(outDir, entry.file)
            const code = await fs.promises.readFile(filename, 'utf-8')
            const rebasedCode = await rebaseImports(assetsBase, code)

            fs.promises.rm(filename)

            return `<script type="module">${rebasedCode}</script>`
          })
          html = html.replace('</head>', `${stringifyPreload(manifest, preloadScripts)}</head>`)
          await fs.promises.writeFile(htmlFilename, html, 'utf-8')
        }))
        fs.rmSync(islandsConfig.tempDir, { recursive: true, force: true })
      },
    } as ViteSSGOptions,
  }
}

// Public: Configures MDX, Vue, Components, and Islands plugins.
export default function IslandsPlugins (): PluginOption[] {
  return [
    {
      name: 'islands',
      resolveId (id) {
        if (id === SITE_DATA_REQUEST_PATH)
          return SITE_DATA_REQUEST_PATH

        if (id === ROUTES_REQUEST_PATH)
          return 'virtual:generated-pages'

        if (id === USER_CONFIG_REQUEST_PATH)
          return USER_CONFIG_REQUEST_PATH
      },
      load (id) {
        // TODO: Provide actual site data.
        const siteData = { base: '/' }

        if (id === SITE_DATA_REQUEST_PATH)
          return `export default ${JSON.stringify(JSON.stringify(siteData))}`

        if (id === USER_CONFIG_REQUEST_PATH) {
          const configPath = path.join(root, 'iles.config.ts')
          this.addWatchFile(configPath)
          return fs.readFileSync(configPath, 'utf-8')
        }
      },
      transform (code, id) {
        return code.replace(/__LAYOUTS_ROOT__/g, '/src/layouts')
      },
      configureServer (server) {
        // server.watcher.add(configPath)

        // serve our index.html after vite history fallback
        return () => {
          server.middlewares.use((req, res, next) => {
            if (req.url!.endsWith('.html')) {
              res.statusCode = 200
              res.end(`
  <!DOCTYPE html>
  <html>
    <head>
      <title></title>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width,initial-scale=1">
      <meta name="description" content="">
    </head>
    <body>
      <div id="app"></div>
      <script type="module" src="/@fs/${APP_PATH}/index.js"></script>
    </body>
  </html>`)
              return
            }
            next()
          })
        }
      },
    },
    {
      name: 'islands:wrap-components',
      enforce: 'pre',
      config,
      configResolved (config) {
        debug.build('minify:', config.build.minify)
        if (base) return
        base = config.base
        assetsDir = config.build.assetsDir
        outDir = config.build.outDir
        logger = config.logger
        mode = config.mode
        root = config.root
        islandsConfig = (config as any).islands
        resolveVitePath = config.createResolver()
        debug.wrap({ outDir, assetsDir })
      },
      async transform (code, id) {
        const { path } = parseId(id)
        if (!path.endsWith('.mdx') && !path.endsWith('.vue')) return

        const components = /<([A-Z]\w+)\s*(?:([^/]+?)\/>|([^>]+)>(.*?)<\/\1>)/sg

        // Parse imports and set options as needed.
        const scriptContent = path.endsWith('.vue') && Array.from(code.matchAll(scriptTagsRegex)).map(([,, js]) => js).join(';')
        const imports = scriptContent
          ? await parseImports(scriptContent)
          : {}

        return code.replace(components, (str, tagName, attrs, otherAttrs, children) => {
          if (otherAttrs) attrs = otherAttrs
          if (!attrs?.match(/(\s|^)client:/)) return str

          debug.wrap(tagName, attrs)

          const resolveComponent = imports[tagName] ? tagName : `_resolveComponent("${tagName}")`
          const component = path.endsWith('.vue')
            ? `:${unresolvedIslandKey}='${resolveComponent}'`
            : `${unresolvedIslandKey}={${resolveComponent}}`

          return `<ViteIsland componentName="${pascalCase(tagName)}" ${component} ${attrs}>${children || ''}</ViteIsland>`
        })
      },
    },

    Vue({
      refTransform: true,
      template: {
        compilerOptions: {
          isCustomElement: (tagName: string) => tagName.startsWith('ile-'),
        },
      },
    }),

    XDM({
      jsx: true,
    }),

    {
      name: 'islands:mdx',
      async transform (code, id) {
        const { path } = parseId(id)
        if (!path.endsWith('.mdx') || !code.includes('MDXContent')) return null

        const match = code.match(/props\.components\), \{(.*?), wrapper: /)
        const importedComponents = match ? match[1].split(', ') : []
        debug.mdx(`transforming (${importedComponents.length})`, importedComponents)

        const pattern = '_components = Object.assign({'
        const index = code.indexOf(pattern) + pattern.length
        const comps = importedComponents.map(name => `    ${name}: _resolveComponent("${name}"),`).join('\n')
        code = `${code.slice(0, index)}\n${comps}\n${code.slice(index, code.length + 1)}`

        // Allow mdx pages with only frontmatter.
        code = code.replace('_content = <></>', '_content = null')

        // TODO: Allow component to receive an excerpt prop.
        return code.replace('export default MDXContent', `
          ${code.includes(' defineComponent') ? '' : 'import { defineComponent } from \'vue\''}

          const _default = defineComponent({
            ${mode === 'development' ? `__file: '${path}',` : ''}
            ...frontmatter,
            frontmatter,
            props: {
              components: { type: Object, default: () => ({}) },
            },
            render () {
              return MDXContent({ ...this.$props, ...this.$attrs })
            },
          })
          export const content = _default
          export default _default
        `)
      },
    },

    VueJSX({
      include: /\.[jt]sx|mdx?$/,
    }),

    // https://github.com/hannoeru/vite-plugin-pages
    Pages({
      extensions: ['vue', 'md', 'mdx'],
      extendRoute (route) {
        const file = path.resolve(root, route.component.slice(1))
        if (file.endsWith('.mdx') || file.endsWith('.md')) {
          const md = fs.readFileSync(file, 'utf-8')
          const { data: { layout, ...frontmatter } } = matter(md)
          route.meta = Object.assign(route.meta || {}, { frontmatter, layout })
          if (file.includes('posts/') && !file.endsWith('index.vue'))
            route.meta.layout = 'post'
        }
        return route
      },
    }),

    // https://github.com/JohnCampionJr/vite-plugin-vue-layouts
    Layouts(),

    // https://github.com/antfu/vite-plugin-components
    ViteComponents({
      dts: true,
      // allow auto load markdown components under `./src/components/`
      extensions: ['vue'],

      // allow auto import and register components used in markdown
      include: [/\.vue$/, /\.vue\?vue/, /\.mdx?/],

      // auto import icons
      resolvers: [
        // https://github.com/antfu/vite-plugin-icons
        IconsResolver({
          componentPrefix: '',
          // enabledCollections: ['carbon']
        }),
        (name) => {
          if (name === 'ViteIsland' || name === 'Island')
            return { importName: 'Island', path: 'iles' }
          else
            return null
        },
      ],
    }),

    {
      name: 'islands:import-analysis',
      enforce: 'post',
      async transform (code, id) {
        const { path } = parseId(id)
        if (!path.endsWith('.mdx') && !path.endsWith('.vue')) return

        code = code.replace(contextComponentRegex, '__unplugin_components_')

        if (!code.includes(unresolvedIslandKey)) return code

        const imports = await parseImports(code)
        code = await replaceAsync(code, viteIslandRegex, async (str, resolvedName) => {
          resolvedName = resolvedName.replace(/^\$setup\./, '')
          const importMetadata = imports[resolvedName]

          const componentName = resolvedName.match(/_resolveComponent\(([^)]+?)\)/)?.[1]

          if (!importMetadata)
            throw new Error(`Unable to infer '${componentName}' island component in ${path}`)

          debug.resolve(`${componentName} => ${importMetadata.path}`)

          return `
            component: ${resolvedName},
            importName: '${importMetadata.name}',
            importPath: '${await resolveVitePath(importMetadata.path, path)}',
          `
        })

        if (path.endsWith('.mdx')) {
          const name = code.match(/_resolveComponent\(([^)]+?)\)/)?.[1]
          if (name)
            throw new Error(`Unable to infer '${name}' component in ${path}`)
        }

        return code
      },
    },
  ]
}
