import { defineConfig } from 'iles'

import iconsResolver from 'unplugin-icons/resolver'
import { FileSystemIconLoader } from 'unplugin-icons/loaders'

import icons from 'unplugin-icons/vite'
import windicss from 'vite-plugin-windicss'
import inspect from 'vite-plugin-inspect'

export default defineConfig({
  siteUrl: 'https://iles-docs.netlify.app',
  jsx: 'preact',
  ssg: {
    manualChunks: (id, api) => {
      if (id.includes('preact') || id.includes('algolia') || id.toLowerCase().includes('docsearch'))
        return 'docsearch'
    },
  },
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
    optimizeDeps: {
      include: ['quicklink', '@vueuse/core', '@mussi/docsearch'],
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
