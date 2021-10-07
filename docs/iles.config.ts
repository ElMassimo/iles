import { defineConfig } from 'iles'

import iconsResolver from 'unplugin-icons/resolver'
import { FileSystemIconLoader } from 'unplugin-icons/loaders'

import icons from 'unplugin-icons/vite'
import windicss from 'vite-plugin-windicss'
import inspect from 'vite-plugin-inspect'

export default defineConfig({
  debug: 'log',
  siteUrl: 'https://iles-docs.netlify.app',
  components: {
    resolvers: [iconsResolver({ componentPrefix: '', customCollections: ['iles'] })],
  },
  markdown: {
    rehypePlugins: [
      import('@islands/headers').then(m => m.default),
      ['@mapbox/rehype-prism', { alias: { markup: ['html', 'vue'], markdown: ['mdx'] } }],
    ],
  },
  vite: {
    resolve: {
      alias: [
        { find: /^react(\/|$)/, replacement: 'preact/compat$1' },
        { find: /^react-dom(\/|$)/, replacement: 'preact/compat$1' },
      ],
    },
    optimizeDeps: {
      include: ['quicklink', '@vueuse/core', '@docsearch/js'],
    },
    plugins: [
      icons({
        autoInstall: true,
        customCollections: {
          iles: FileSystemIconLoader('./images'),
        },
      }),
      windicss(),
      Boolean(process.env.DEBUG) && inspect(),
    ],
  },
})
