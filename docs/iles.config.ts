import { resolve } from 'path'
import { defineConfig } from 'iles'

import headings from '@islands/headings'
import icons from '@islands/icons'
import prism from '@islands/prism'
import pwa from '@islands/pwa'
import excerpt from '@islands/excerpt'
import reactivityTransform from '@vue-macros/reactivity-transform/vite'

import UnoCSS from 'unocss/vite'
import inspect from 'vite-plugin-inspect'
import lastUpdated from './modules/lastUpdated'
import site from './src/site'

const { title, description } = site

export default defineConfig({
  siteUrl: 'https://iles-docs.netlify.app',

  extendFrontmatter(frontmatter, filename) {
    if (filename.includes('/recipes/') && !filename.includes('/recipes/index.vue')) {
      frontmatter.layout = 'recipe'
    }
  },

  turbo: true,
  jsx: 'preact',
  debug: false,
  modules: [
    headings(),
    icons(),
    prism(),
    excerpt({ maxLength: 140 }),
    lastUpdated(),
    pwa({
      manifestFilename: 'pwa-manifest.json',
      manifest: {
        id: '/',
        name: title,
        short_name: title,
        description,
        theme_color: '#5C7E8F',
        background_color: '#ffffff',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any maskable',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,svg,ico,png,avif,json,xml,html}'],
      },
    }),
  ],
  markdown: {
    rehypePlugins: [
      [
        'rehype-external-links',
        {
          target: '_blank',
          rel: ['noopener'],
          test: (node: any) => /^https?:\/\//.test(node.properties.href),
        },
      ],
    ],
  },
  autoImport: {
    imports: [
      '@vueuse/core', // auto-import composables from library
    ],
    dirs: [
      // 'src/composables', // already added by Îles
      'src/logic', // auto-import composables from `src/logic` folder
    ],
  },
  ssg: {
    manualChunks(id, api) {
      if (id.includes('preact') || id.includes('algolia') || id.toLowerCase().includes('docsearch'))
        return 'docsearch'
    },
  },
  vite: {
    resolve: {
      alias: {
        '~images': resolve(__dirname, 'images'),
      },
    },
    plugins: [
      reactivityTransform(),
      UnoCSS() as any,
      Boolean(process.env.DEBUG) && inspect() as any,
    ],
  },
})
