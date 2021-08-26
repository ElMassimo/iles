import path from 'path'
import { defineConfig } from 'vite'
import Vue from '@vitejs/plugin-vue'
import Pages from 'vite-plugin-pages'
import Layouts from 'vite-plugin-vue-layouts'
import ViteIcons, { ViteIconsResolver } from 'vite-plugin-icons'
import ViteComponents from 'vite-plugin-components'
import WindiCSS from 'vite-plugin-windicss'
import viteSSR from 'vite-ssr/plugin'

import VueJSX from '@vitejs/plugin-vue-jsx'
import XDM from './packages/xdm'
import Inspect from 'vite-plugin-inspect'

export default defineConfig({
  resolve: {
    alias: {
      '~/': `${path.resolve(__dirname, 'src')}/`,
    },
  },
  plugins: [
    viteSSR(),

    {
      name: 'ile',
      transform (code, id) {
        if (!id.endsWith('.mdx') && !id.endsWith('.vue')) return

        const components = /<([A-Z]\w+)\s*(?:([^/]+?)\/>|([^>]+)>(.*?)<\/\1>)/sg

        return code.replace(components, (str, tagName, attrs, otherAttrs, children) => {
          if (otherAttrs) attrs = otherAttrs
          if (tagName === 'AudioPlayer' || tagName === 'DarkModeSwitch')
            console.log({ str, tagName, attrs, children })
          if (!attrs?.match(/(\s|^)client:/)) return str

          const component = id.endsWith('.vue')
            ? `:component='_resolveComponent("${tagName}")'`
            : `component={props.components.${tagName}}`
          return `<IleComponent ${component} ${attrs}>${children || ''}</IleComponent>`
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
      transform (code, id) {
        if (!id.endsWith('.mdx') || !code.includes('MDXContent')) return null

        if (code.includes('IleComponent')) {
          code = `import IleComponent from '~/components/IleComponent.vue'\n${code}`
          code = code.replace('IleComponent, ', '')
        }
        return code.replace('export default MDXContent', `
          ${code.includes('defineComponent') ? '' : "import { defineComponent } from 'vue'"}

          export default defineComponent({
            props: {
              components: { type: Object, default: () => ({}) },
            },
            render () {
              return MDXContent({ ...this.$props, ...this.$attrs })
            },
          })
        `)
      },
    },

    VueJSX({
      include: /\.[jt]sx|mdx?$/
    }),

    // https://github.com/hannoeru/vite-plugin-pages
    Pages({
      extensions: ['vue', 'md', 'mdx'],

      importMode(path) {
        return path.endsWith('mdx') ? 'sync' : 'async';
      },
    }),

    // https://github.com/JohnCampionJr/vite-plugin-vue-layouts
    Layouts(),

    // https://github.com/antfu/vite-plugin-components
    ViteComponents({
      // allow auto load markdown components under `./src/components/`
      extensions: ['vue', 'md', 'mdx'],

      // allow auto import and register components used in markdown
      customLoaderMatcher: id => id.endsWith('.md') || id.endsWith('.mdx'),

      // auto import icons
      customComponentResolvers: [
        // https://github.com/antfu/vite-plugin-icons
        ViteIconsResolver({
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

    {
      name: 'ile-post',
      enforce: 'post',
      transform (code, id) {
        if (!id.endsWith('.vue')) return

        return code.replace('_ctx.__vite_components_', '__vite_components_')
      },
    },

    // https://github.com/antfu/vite-plugin-icons
    ViteIcons(),

    // https://github.com/antfu/vite-plugin-windicss
    WindiCSS(),

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
