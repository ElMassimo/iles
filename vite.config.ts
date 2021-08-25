import path from 'path'
import { defineConfig, resolveConfig } from 'vite'
import type { Plugin } from 'vite'
import Vue from '@vitejs/plugin-vue'
import Pages from 'vite-plugin-pages'
import Layouts from 'vite-plugin-vue-layouts'
import ViteIcons, { ViteIconsResolver } from 'vite-plugin-icons'
import ViteComponents from 'vite-plugin-components'
import WindiCSS from 'vite-plugin-windicss'
import { VitePWA } from 'vite-plugin-pwa'
import VueI18n from '@intlify/vite-plugin-vue-i18n'
import viteSSR from 'vite-ssr/plugin'
import {createFilter} from '@rollup/pluginutils'

import VueJSX from '@vitejs/plugin-vue-jsx'
import Inspect from 'vite-plugin-inspect'

function XDM (options = {}): Plugin {
  let processor
  let filter
  let VFile

  return {
    name: 'xdm',

    async transform (value, path) {
      if (!processor) {
        const {include, exclude, ...rest} = options
        rest.remarkPlugins = [
          (await import('remark-mdx-images')).remarkMdxImages,
          (await import('remark-frontmatter')).default,
          (await import('remark-mdx-frontmatter')).remarkMdxFrontmatter,
        ]
        VFile = (await import('vfile')).VFile
        const { createFormatAwareProcessors } =
          await import('xdm/lib/util/create-format-aware-processors.js')
        processor = createFormatAwareProcessors(rest)
        filter = createFilter(include, exclude)
      }

      const file = new VFile({value, path})

      if (filter(file.path) && processor.extnames.includes(file.extname)) {
        const compiled = await processor.process(file)
        // @ts-expect-error `map` is added if a `SourceMapGenerator` is passed in.
        return {code: String(compiled.value), map: compiled.map}
        // V8 on Erbium.
        /* c8 ignore next 2 */
      }
    }
  }
}

export default defineConfig({
  resolve: {
    alias: {
      '~/': `${path.resolve(__dirname, 'src')}/`,
    },
  },
  plugins: [
    viteSSR(),

    XDM({
      jsx: true,
    }),

    Vue({
      refTransform: true,
    }),

    {
      name: 'mdx-transform',
      transform (code, id) {
        if (!id.endsWith('.mdx')) return null
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
    }),

    // https://github.com/JohnCampionJr/vite-plugin-vue-layouts
    Layouts(),

    // https://github.com/antfu/vite-plugin-components
    ViteComponents({
      // allow auto load markdown components under `./src/components/`
      extensions: ['vue', 'md'],

      // allow auto import and register components used in markdown
      customLoaderMatcher: id => id.endsWith('.md'),

      // auto import icons
      customComponentResolvers: [
        // https://github.com/antfu/vite-plugin-icons
        ViteIconsResolver({
          componentPrefix: '',
          // enabledCollections: ['carbon']
        }),
      ],
    }),

    // https://github.com/antfu/vite-plugin-icons
    ViteIcons(),

    // https://github.com/antfu/vite-plugin-windicss
    WindiCSS(),

    // https://github.com/antfu/vite-plugin-pwa
    VitePWA({
      manifest: {
        name: 'Vitesse',
        short_name: 'Vitesse',
        theme_color: '#ffffff',
        icons: [
          {
            src: '/pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: '/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',
          },
        ],
      },
    }),

    // https://github.com/intlify/vite-plugin-vue-i18n
    VueI18n({
      include: [path.resolve(__dirname, 'src/i18n/translations/**')],
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
