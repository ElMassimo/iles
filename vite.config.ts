import path from 'path'
import fs from 'fs'
import { defineConfig } from 'vite'
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

let mode = 'production'

export default defineConfig({
  resolve: {
    alias: {
      '~/': `${path.resolve(__dirname, 'src')}/`,
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
        if (!id.endsWith('.mdx') && !id.endsWith('.vue')) return

        const components = /<([A-Z]\w+)\s*(?:([^/]+?)\/>|([^>]+)>(.*?)<\/\1>)/sg

        return code.replace(components, (str, tagName, attrs, otherAttrs, children) => {
          if (otherAttrs) attrs = otherAttrs
          if (!attrs?.match(/(\s|^)client:/)) return str
          const component = id.endsWith('.vue')
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
      config (_, env) {
        mode = env.mode
      },
      transform (code, id) {
        if (!id.endsWith('.mdx') || !code.includes('MDXContent')) return null

        // if (code.includes('IleComponent')) {
        //   code = `import IleComponent from '~/components/IleComponent.vue'\n${code}`
        //   code = code.replace('IleComponent, ', '')
        // }

        const match = code.match(/props\.components\), \{(.*?), wrapper: /)
        const importedComponents = match ? match[1].split(',') : []

        const pattern = '_components = Object.assign({'
        const index = code.indexOf(pattern) + pattern.length
        const comps = importedComponents.map(name => `    ${name}: _resolveComponent("${name}"),`).join("\n")
        console.log(match && match[1], importedComponents, comps)
        code = code.slice(0, index) + `\n${comps}\n` + code.slice(index + 1, code.length)

        return code.replace('export default MDXContent', `
          ${code.includes('defineComponent') ? '' : "import { defineComponent } from 'vue'"}

          const _default = defineComponent({
            ${mode === 'development' ? `__file: '${id}',` : ''}
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
      include: [/\.vue$/, /\.vue?vue/, /\.mdx?/],

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
        if (!id.endsWith('.mdx') && !id.endsWith('.vue')) return

        code = code.replaceAll('_ctx.__unplugin_components_', '__unplugin_components_')

        const files = /"?ileFile"?(="|:\s)([^",]+)"?/sg
        code = code.replace(files, (str, separator, importVar) => {
          const match = code.match(new RegExp(`import ${escapeRegex(importVar)} from (['"])(.*?)\\1`))
          console.warn(match, { importVar })
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
