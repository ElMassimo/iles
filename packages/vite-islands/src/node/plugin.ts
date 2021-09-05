import { build as viteBuild } from 'vite'
import type { Manifest, PluginOption, ResolvedConfig } from 'vite'

import Vue from '@vitejs/plugin-vue'
import Pages from 'vite-plugin-pages'
import Layouts from 'vite-plugin-vue-layouts'
import IconsResolver from 'unplugin-icons/resolver'
import ViteComponents from 'unplugin-vue-components/vite'
import VueJSX from '@vitejs/plugin-vue-jsx'
import XDM from 'vite-plugin-xdm'

import matter from 'gray-matter'
import { uniq } from './utils/array'
import { parseImports, rebaseImports } from './utils/parse'
import { escapeRegex, pascalCase, serialize } from './utils/string'

import type { IslandsConfig } from './node/config'

import path from 'path'
import fs from 'fs'
import glob from 'fast-glob'
import chalk from 'chalk'
import createDebugger from 'debug'

const debug = {
  mdx: createDebugger('vite-islands:mdx'),
  wrap: createDebugger('vite-islands:wrap'),
  resolve: createDebugger('vite-islands:resolve'),
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

export function parseId (id: string) {
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
${chalk.gray("[isles]")} ${chalk.yellow(text)}${count ? chalk.blue(` (${count})`) : ""}`);
}

async function replaceAsync (str: string, regex: RegExp, asyncFn: (...groups: string[]) => Promise<string>) {
  const promises = Array.from(str.matchAll(regex))
    .map(([match, ...args]) => asyncFn(match, ...args))
  const replacements = await Promise.all(promises)
  return str.replace(regex, () => replacements.shift()!)
}

let base: ResolvedConfig['base']
let assetsDir: ResolvedConfig['build.assetsDir']
let outDir: ResolvedConfig['build.outDir']
let logger: ResolvedConfig['logger']
let mode: ResolvedConfig['mode']
let root: ResolvedConfig['root']
let resolveVitePath: ReturnType<ResolvedConfig['createResolver']>
let islandsConfig: IslandsConfig

const hydrationBegin = '<!--ILE_HYDRATION_BEGIN-->'
const hydrationEnd = '<!--ILE_HYDRATION_END-->'
const slotBegin = '<!--ILE_SLOT_BEGIN-->'
const slotSeparator = `ILE_SLOT_SEPARATOR`
const commentsRegex = /<!--\[-->|<!--]-->/g
const hydrationRegex = new RegExp(`${escapeRegex(hydrationBegin)}(.*?)${escapeRegex(hydrationEnd)}`, 'sg')
const contextComponentRegex = new RegExp(escapeRegex('_ctx.__unplugin_components_'), 'g')
const ileResolvedComponentKey = '__ileResolvedComponent'
const viteIslandRegex = new RegExp(`"?${escapeRegex(ileResolvedComponentKey)}"?:\\s*([^,]+),`, 'sg')
const scriptTagsRegex = /<script\s*([^>]*?)>(.*?)<\/script>/sg

const islandsByRoute: Record<string, string[]> = Object.create(null)

function config (config: Config) {
  return {
    build: {
      minify: false,
    },
    optimizeDeps: {
      include: [
        'vue',
        'vue-router',
        '@vueuse/core',
      ],
      exclude: [
        'vue-demi',
      ],
    },
    islands: {
      tempDir: path.resolve(config.root, '.vite-island-temp'),
    },
    ssgOptions: {
      async onPageRendered (route, html) {
        let counter = 0
        const pageIslands: string[] = []
        const assetsBase = path.join(base, assetsDir)
        const pageOutDir = path.resolve(islandsConfig.tempDir, route === '/' ? 'index' : route.replace(/^\//, '').replace(/\//g, '-'))
        fs.mkdirSync(pageOutDir, { recursive: true })
        html = html.replace(scriptTagsRegex, (script, attrs) => {
          return !attrs.includes('client-keep') && attrs.includes('type="module"') && attrs.includes(`src="${assetsBase}`)
            ? ''
            : script
        })
        html = html.replace(/<link\s*([^>]*?)>/sg, (link, attrs) => {
          if (attrs.includes('modulepreload') && attrs.includes('.js')) return ''
          return link
        })
        html = html.replace(hydrationRegex, (str, ileContent) => {
          const basename = `vite-island-${++counter}.js`
          const filename = path.join(pageOutDir, basename)
          const [scriptTemplate, ...slotStrs] = ileContent.replace(commentsRegex, '').split(slotBegin)
          const slots = Object.fromEntries(slotStrs.map(str => str.split(slotSeparator)))
          const script = scriptTemplate.replace('/* ILE_HYDRATION_SLOTS */', devalue(slots))
          fs.writeFileSync(filename, script, 'utf-8')
          pageIslands.push(filename)
          return `${hydrationBegin}${filename}${hydrationEnd}`
        })
        if (pageIslands.length) {
          islandsByRoute[route] = pageIslands
          logger.warn(`${chalk.dim(`${path.relative(root, pageOutDir)}`)} ${chalk.blue(` (${pageIslands.length})`)}`)
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
            emptyOutDir: false,
            manifest: true,
            outDir,
            rollupOptions: {
              input: islandFiles,
            },
          },
          mode: mode,
        })
        const manifest: Manifest = JSON.parse(fs.readFileSync(path.join(outDir, 'manifest.json'), 'utf-8'))
        // console.log({ outDir, manifest, islandsByRoute })
        await Promise.all(Object.keys(islandsByRoute).map(async route => {
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
    }
  }
}

// Public: Configures MDX, Vue, Components, and Islands plugins.
export default function ViteIslandsPlugin (): PluginOption[] {
  return [
    {
      name: 'vite-islands:wrap-components',
      enforce: 'pre',
      config,
      configResolved (config) {
        base = config.base
        assetsDir = config.build.assetsDir
        outDir = config.build.outDir
        logger = config.logger
        mode = config.mode
        root = config.root
        islandsConfig = (config as any).islands
        resolveVitePath = config.createResolver()
      },
      async transform (code, id) {
        const { path } = parseId(id)
        if (!path.endsWith('.mdx') && !path.endsWith('.vue')) return

        const components = /<([A-Z]\w+)\s*(?:([^/]+?)\/>|([^>]+)>(.*?)<\/\1>)/sg

        // Parse imports and set options as needed.
        const scriptContent = path.endsWith('.vue') && Array.from(code.matchAll(scriptTagsRegex)).map(([,,js]) => js).join(';')
        const imports = scriptContent
          ? await parseImports(scriptContent)
          : {}

        return code.replace(components, (str, tagName, attrs, otherAttrs, children) => {
          if (otherAttrs) attrs = otherAttrs
          if (!attrs?.match(/(\s|^)client:/)) return str

          debug.wrap(tagName, attrs)

          const resolveComponent = imports[tagName] ? tagName : `_resolveComponent("${tagName}")`
          const component = path.endsWith('.vue')
            ? `:${ileResolvedComponentKey}='${resolveComponent}'`
            : `${ileResolvedComponentKey}={${resolveComponent}}`

          return `<ViteIsland componentName="${pascalCase(tagName)}" ${component} ${attrs}>${children || ''}</ViteIsland>`
        })
      },
    },

    Vue({
      refTransform: true,
      template: {
        compilerOptions: {
          isCustomElement: tagName => tagName.startsWith('ile-'),
        },
      },
    }),

    XDM({
      jsx: true,
    }),

    {
      name: 'vite-islands:mdx',
      async transform (code, id) {
        const { path } = parseId(id)
        if (!path.endsWith('.mdx') || !code.includes('MDXContent')) return null

        const match = code.match(/props\.components\), \{(.*?), wrapper: /)
        const importedComponents = match ? match[1].split(', ') : []
        debug.mdx(`transforming (${importedComponents.length})`, importedComponents)

        const pattern = '_components = Object.assign({'
        const index = code.indexOf(pattern) + pattern.length
        const comps = importedComponents.map(name => `    ${name}: _resolveComponent("${name}"),`).join('\n')
        code = `${code.slice(0, index)}\n${comps}\n${code.slice(index + 1, code.length)}`

        return code.replace('export default MDXContent', `
          ${code.includes('defineComponent') ? '' : 'import { defineComponent } from \'vue\''}

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
        const file = path.resolve(__dirname, route.component.slice(1))
        if (file.endsWith('.mdx') || file.endsWith('.md')) {
          const md = fs.readFileSync(file, 'utf-8')
          const { data } = matter(md)
          route.meta = Object.assign(route.meta || {}, { frontmatter: data })
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
      extensions: ['vue', 'md', 'mdx'],

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
            return { importName: 'ViteIsland', path: 'vite-islands/components' }
          else
            return null
        },
      ],
    }),

    {
      name: 'vite-islands:import-analysis',
      enforce: 'post',
      async transform (code, id) {
        const { path } = parseId(id)
        if (!path.endsWith('.mdx') && !path.endsWith('.vue')) return

        code = code.replace(contextComponentRegex, '__unplugin_components_')

        if (!code.includes(ileResolvedComponentKey)) return code

        const imports = await parseImports(code)
        code = await replaceAsync(code, viteIslandRegex, async (str, resolvedName) => {
          resolvedName = resolvedName.replace(/^\$setup\./, '')
          const importMetadata = imports[resolvedName]

          const componentName = str.match(/componentName="([^"]+)"/)?.[1]

          if (!importMetadata)
            throw new Error(`Unable to infer '${componentName}' island component in ${path}`)

          debug.resolve(`${componentName} => ${importMetadata.path}`)

          return `
            component: ${resolvedName},
            importName: '${importMetadata.name}',
            importPath: '${await resolveVitePath(importMetadata.path, path)}',
          `
        })

        let match
        if (path.endsWith('.mdx') && (match = code.match(/_resolveComponent\(([^)]+?)\)/)))
          throw new Error(`Unable to infer '${match[1]}' component in ${path}`)

        return code
      },
    },
  ]
}
