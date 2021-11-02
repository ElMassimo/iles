import { defineConfig } from 'iles'

import windicss from 'vite-plugin-windicss'
import inspect from 'vite-plugin-inspect'

export default defineConfig({
  siteUrl: 'https://iles-docs.netlify.app',
  jsx: 'preact',
  modules: [
    '@islands/headings',
    '@islands/icons',
  ],
  ssg: {
    manualChunks: (id, api) => {
      if (id.includes('preact') || id.includes('algolia') || id.toLowerCase().includes('docsearch'))
        return 'docsearch'
    },
  },
  markdown: {
    rehypePlugins: [
      ['@mapbox/rehype-prism', { alias: { markup: ['html', 'vue'], markdown: ['mdx'] } }],
    ],
  },
  vite: {
    optimizeDeps: {
      include: ['quicklink', '@vueuse/core', '@mussi/docsearch', 'preact', 'preact/debug'],
    },
    plugins: [
      windicss(),
      Boolean(process.env.DEBUG) && inspect(),
    ],
  },
})
