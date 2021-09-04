import path from 'path'
import fs from 'fs'
import chalk from 'chalk'
import { build, defineConfig } from 'vite'
import type { Manifest, ManifestChunk, ResolvedConfig } from 'vite'
import Vue from '@vitejs/plugin-vue'
import Pages from 'vite-plugin-pages'
import Layouts from 'vite-plugin-vue-layouts'
import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'
import ViteComponents from 'unplugin-vue-components/vite'
import WindiCSS from 'vite-plugin-windicss'
import viteSSR from 'vite-ssr/plugin'

import VueJSX from '@vitejs/plugin-vue-jsx'
import matter from 'gray-matter'

import Inspect from 'vite-plugin-inspect'
import XDM from './packages/xdm'
import devalue from '@nuxt/devalue'

import { pascalCase, escapeRegex, parseImports } from './src/parse'

function getSize (str: string) {
  return `${(str.length / 1024).toFixed(2)}KiB`
}

function resolveManifestEntries (manifest: Manifest, entryNames: string[]): string[] {
  return entryNames.flatMap((entryName) => {
    const entry = manifest[entryName]
    return [entry.file, ...resolveManifestEntries(manifest, entry.imports || [])]
  })
}

function uniq<T> (arr: Array<T>) {
  return [...new Set(arr.filter(x => x))]
}

function stringifyPreload (manifest: Manifest, hrefs: string[]) {
  return uniq(resolveManifestEntries(manifest, hrefs))
    .map(href => `<link rel="modulepreload" href="${path.join(config.base, href)}" crossorigin/>`)
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

function routeFilename (route: string) {
  const relativeRoute = (route.endsWith('/') ? `${route}index` : route).replace(/^\//g, '')
  const filename = `${relativeRoute}.html`
  return path.join(config.build.outDir, filename)
}

let config: ResolvedConfig

const hydrationBegin = '<!--ILE_HYDRATION_BEGIN-->'
const hydrationEnd = '<!--ILE_HYDRATION_END-->'
const slotBegin = '<!--ILE_SLOT_BEGIN-->'
const slotSeparator = `ILE_SLOT_SEPARATOR`
const commentsRegex = /<!--\[-->|<!--]-->/g
const hydrationRegex = new RegExp(`${escapeRegex(hydrationBegin)}(.*?)${escapeRegex(hydrationEnd)}`, 'sg')
const contextComponentRegex = new RegExp(escapeRegex('_ctx.__unplugin_components_'), 'g')
const ileResolvedComponentKey = '__ileResolvedComponent'
const ileComponentRegex = new RegExp(`"?${escapeRegex(ileResolvedComponentKey)}"?:\\s*([^,]+),`, 'sg')

const islandsByRoute: Record<string, string[]> = Object.create(null)

export default defineConfig({
  resolve: {
    alias: {
      '~/': `${path.resolve(__dirname, 'src')}/`,
    },
  },
  ssgOptions: {
    async onPageRendered (route, html) {
      let counter = 0
      const pageIslands: string[] = []
      const pageOutDir = path.resolve(config.build.outDir, '.ile-temp', route === '/' ? 'index' : route.replace(/^\//, '').replace(/\//g, '-'))
      fs.mkdirSync(pageOutDir, { recursive: true })
      html = html.replace(/<script\s*([^>]*?)>.*?<\/script>/sg, (script, attrs) => {
        if (attrs.includes('client-keep') || !attrs.includes('module')) return script
        return ''
      })
      html = html.replace(/<link\s*([^>]*?)>/sg, (link, attrs) => {
        if (attrs.includes('modulepreload') && attrs.includes('.js')) return ''
        return link
      })
      html = html.replace(hydrationRegex, (str, ileContent) => {
        const basename = `ile-${++counter}.js`
        const filename = path.join(pageOutDir, basename)
        const [scriptTemplate, ...slotStrs] = ileContent.replace(commentsRegex, '').split(slotBegin)
        const slots = Object.fromEntries(slotStrs.map(str => str.split(slotSeparator)))
        const script = scriptTemplate.replace('/* ILE_HYDRATION_SLOTS */', devalue(slots))
        config.logger.warn(`${chalk.dim(`${pageOutDir}/`)}${chalk.cyan(basename)} ${chalk.dim(getSize(script))}`)
        fs.writeFileSync(filename, script, 'utf-8')
        pageIslands.push(filename)
        return `${hydrationBegin}${filename}${hydrationEnd}`
      })
      if (pageIslands.length) islandsByRoute[route] = pageIslands
      return html
    },
    async onFinished () {
      const islandFiles = Object.values(islandsByRoute).flat()
      if (islandFiles.length === 0) return

      const outDir = config.build.outDir
      await build({
        publicDir: false,
        build: {
          emptyOutDir: false,
          manifest: true,
          outDir,
          rollupOptions: {
            input: islandFiles,
          },
        },
        mode: config.mode,
      })
      const manifest: Manifest = JSON.parse(fs.readFileSync(path.join(outDir, 'manifest.json'), 'utf-8'))
      // console.log({ outDir, manifest, islandsByRoute })
      await Promise.all(Object.entries(islandsByRoute).map(async ([route, scriptFiles]) => {
        const htmlFilename = routeFilename(route)
        let html = fs.readFileSync(htmlFilename, 'utf-8')
        const entriesByFilename: Record<string, ManifestChunk> = Object.fromEntries(await Promise.all(scriptFiles.map(async (file) => {
          return [
            file,
            manifest[path.relative(config.root, file)],
          ]
        })))
        const preloadScripts: string[] = []
        // console.log(entriesByFilename)
        html = html.replace(hydrationRegex, (str, file) => {
          const entry = entriesByFilename[file]
          if (entry.imports) preloadScripts.push(...entry.imports)
          // console.log({ file, entry })
          return `<script type="module" src="${path.join(config.base, entry.file)}"></script>`
        })
        html = html.replace('</head>', `${stringifyPreload(manifest, preloadScripts)}</head>`)
        await fs.promises.writeFile(htmlFilename, html, 'utf-8')
      }))
      fs.rmSync(path.resolve(config.build.outDir, '.ile-temp'), { recursive: true, force: true })
    },
  },
  plugins: [
    {
      name: 'build-var',
      apply: 'build',
    },
    {
      name: 'ile',
      transform (code, id) {
        const { path } = parseId(id)
        if (!path.endsWith('.mdx') && !path.endsWith('.vue')) return

        const components = /<([A-Z]\w+)\s*(?:([^/]+?)\/>|([^>]+)>(.*?)<\/\1>)/sg

        return code.replace(components, (str, tagName, attrs, otherAttrs, children) => {
          if (otherAttrs) attrs = otherAttrs
          if (!attrs?.match(/(\s|^)client:/)) return str

          // TODO: Only if not imported directly.
          // Parse imports and set options as needed.
          const resolveComponent = `_resolveComponent("${tagName}")`
          const component = path.endsWith('.vue')
            ? `:${ileResolvedComponentKey}='${resolveComponent}'`
            : `${ileResolvedComponentKey}={${resolveComponent}}`

          return `<IleComponent componentName="${pascalCase(tagName)}" ${component} ${attrs}>${children || ''}</IleComponent>`
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
      name: 'mdx-transform',
      configResolved (resolvedConfig) {
        config = resolvedConfig
      },
      transform (code, id) {
        const { path } = parseId(id)
        if (!path.endsWith('.mdx') || !code.includes('MDXContent')) return null

        // if (code.includes('IleComponent')) {
        //   code = `import IleComponent from '~/components/IleComponent.vue'\n${code}`
        //   code = code.replace('IleComponent, ', '')
        // }

        const match = code.match(/props\.components\), \{(.*?), wrapper: /)
        const importedComponents = match ? match[1].split(', ') : []
        // console.log('mdx-transform', id, importedComponents)

        const pattern = '_components = Object.assign({'
        const index = code.indexOf(pattern) + pattern.length
        const comps = importedComponents.map(name => `    ${name}: _resolveComponent("${name}"),`).join('\n')
        code = `${code.slice(0, index)}\n${comps}\n${code.slice(index + 1, code.length)}`

        return code.replace('export default MDXContent', `
          ${code.includes('defineComponent') ? '' : 'import { defineComponent } from \'vue\''}

          const _default = defineComponent({
            ${config.mode === 'development' ? `__file: '${path}',` : ''}
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
          if (name === 'IleComponent')
            return { importName: name, path: '~/components/IleComponent.vue' }
          else
            return null
        },
      ],
    }),

    // https://github.com/antfu/vite-plugin-icons
    Icons(),

    {
      name: 'ile-post',
      enforce: 'post',
      async transform (code, id) {
        const { path } = parseId(id)
        if (!path.endsWith('.mdx') && !path.endsWith('.vue')) return

        code = code.replace(contextComponentRegex, '__unplugin_components_')

        if (!code.includes(ileResolvedComponentKey)) return code

        const imports = await parseImports(code)
        code = code.replace(ileComponentRegex, (str, resolvedName) => {
          const importMetadata = imports[resolvedName]
          if (!importMetadata) {
            const name = resolvedName.replace(/_resolveComponent\(([^)]+?)\)/, '$1')
            throw new Error(`Unable to infer '${name}' import for island in ${path}`)
          }
          return `
            component: ${resolvedName},
            importName: '${importMetadata.name}',
            importPath: '${importMetadata.path}',
          `
        })

        return code
      },
    },

    // https://github.com/antfu/vite-plugin-windicss
    WindiCSS(),

    viteSSR({
      build: {
        keepIndexHtml: true,
      },
    }),

    Inspect(),
  ],

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
})
