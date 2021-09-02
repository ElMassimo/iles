import path from 'path'
import chalk from 'chalk'
import fs from 'fs'
import { build, defineConfig } from 'vite'
import type { ResolvedConfig } from 'vite'
import Vue from '@vitejs/plugin-vue'
import Pages from 'vite-plugin-pages'
import Layouts from 'vite-plugin-vue-layouts'
import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'
import ViteComponents from 'unplugin-vue-components/vite'
import WindiCSS from 'vite-plugin-windicss'
import viteSSR from 'vite-ssr/plugin'

import VueJSX from '@vitejs/plugin-vue-jsx'
import XDM from './packages/xdm'
import matter from 'gray-matter'

import Inspect from 'vite-plugin-inspect'

function escapeRegex(str: string) {
  return str.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
}

function getSize(str: string) {
  return `${(str.length / 1024).toFixed(2)}KiB`;
}

export function parseId(id: string) {
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
  const relativeRoute = (route.endsWith("/") ? `${route}index` : route).replace(/^\//g, "")
  const filename = `${relativeRoute}.html`
  return path.join(config.build.outDir, filename)
}

let config: ResolvedConfig

const hydrationBegin = '<!--ILE_HYDRATION_BEGIN-->'
const hydrationEnd = '<!--ILE_HYDRATION_END-->'
const hydrationRegex = new RegExp(escapeRegex(hydrationBegin) + '(.*?)' + escapeRegex(hydrationEnd), 'sg')

let islandsByRoute: Record<string, string[]> = Object.create(null)

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
      const pageOutDir = path.resolve(__dirname, '.vite-ssg-temp', route === '/' ? 'index' : route.replace(/^\//, '').replaceAll('/', '-'))
      fs.mkdirSync(pageOutDir, { recursive: true })
      html = html.replace(/<script\s*([^>]*?)>.*?<\/script>/sg, (script, attrs) => {
        if (script.includes('client-keep')) return script
        return ''
      })
      html = html.replace(/<link\s*([^>]*?)>/sg, (link, attrs) => {
        if (attrs.includes('modulepreload') && attrs.includes('.js')) return ''
        return link
      })
      html = html.replace(hydrationRegex, (str, script) => {
        const basename = `ile-${++counter}.js`
        config.logger.warn(`${chalk.dim(`${pageOutDir}/`)}${chalk.cyan(basename)} ${chalk.dim(getSize(script))}`);
        const filename = path.join(pageOutDir, basename)
        pageIslands.push(filename)
        fs.writeFileSync(filename, script, "utf-8")
        return  `${hydrationBegin}${filename}${hydrationEnd}`
      })
      if (pageIslands.length) islandsByRoute[route] = pageIslands
      return html
    },
    async onFinished () {
      const islandFiles = Object.values(islandsByRoute).flat()
      if (islandFiles.length === 0) return

      const outDir = config.build.outDir
      await build({
        logLevel: 'warn',
        publicDir: false,
        build: {
          emptyOutDir: false,
          manifest: true,
          outDir: outDir,
          rollupOptions: {
            input: islandFiles,
          },
        },
        mode: config.mode
      })
      const manifest = JSON.parse(fs.readFileSync(path.join(outDir, 'manifest.json'), 'utf-8'))
      console.log({ outDir, manifest, islandsByRoute })
      await Promise.all(Object.entries(islandsByRoute).map(async ([route, scriptFiles]) => {
        const htmlFilename = routeFilename(route)
        const html = fs.readFileSync(htmlFilename, 'utf-8')
        const entriesByFilename = Object.fromEntries(await Promise.all(scriptFiles.map(async file => {
          return [
            file,
            manifest[path.relative(config.root, file)],
          ]
        })))
        console.log(entriesByFilename)
        const transformed = html.replace(hydrationRegex, (str, file) => {
          console.log({ file, entry: entriesByFilename[file] })
          return `<script type="module" src="${path.join(config.base, entriesByFilename[file].file)}"></script>`
        })
        await fs.promises.writeFile(htmlFilename, transformed, 'utf-8')
      }))
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
          const component = path.endsWith('.vue')
            ? `:ileIs='_resolveComponent("${tagName}")'`
            : `ileIs={_resolveComponent("${tagName}")}`
          const file = component.replace('ileIs=', 'ileFile=')
          return `<IleComponent ${component} ${file} ${attrs}>${children || ''}</IleComponent>`
        })
      },
    },

    Vue({
      refTransform: true,
      template: {
        compilerOptions: {
          isCustomElement: (tagName) => tagName.startsWith('ile-')
        }
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
        const importedComponents = match ? match[1].split(',') : []
        // console.log('mdx-transform', id, importedComponents)

        const pattern = '_components = Object.assign({'
        const index = code.indexOf(pattern) + pattern.length
        const comps = importedComponents.map(name => `    ${name}: _resolveComponent("${name}"),`).join("\n")
        code = code.slice(0, index) + `\n${comps}\n` + code.slice(index + 1, code.length)

        return code.replace('export default MDXContent', `
          ${code.includes('defineComponent') ? '' : "import { defineComponent } from 'vue'"}

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
      include: /\.[jt]sx|mdx?$/
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
      transform (code, id) {
        const { path } = parseId(id)
        if (!path.endsWith('.mdx') && !path.endsWith('.vue')) return

        code = code.replaceAll('_ctx.__unplugin_components_', '__unplugin_components_')

        const files = /"?ileFile"?(="|:\s)([^",]+)"?/sg
        code = code.replace(files, (str, separator, importVar) => {
          const match = code.match(new RegExp(`import ${escapeRegex(importVar)} from (['"])(.*?)\\1`))
          return match ? `ileFile${separator}'${match![2]}'` : str
        })

        return code
      },
    },

    // https://github.com/antfu/vite-plugin-windicss
    WindiCSS(),

    viteSSR({
      build: {
        keepIndexHtml: true,
      }
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
