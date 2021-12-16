import { resolve } from 'path'
import { defineConfig } from 'iles'

import windicss from 'vite-plugin-windicss'
import inspect from 'vite-plugin-inspect'

export default defineConfig({
  siteUrl: 'https://iles-docs.netlify.app',
  turbo: true,
  jsx: 'preact',
  modules: [
    '@islands/headings',
    '@islands/icons',
    '@islands/prism',
  ],
  ssg: {
    manualChunks (id, api) {
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
      windicss(),
      Boolean(process.env.DEBUG) && inspect(),
    ],
    optimizeDeps: {
      include: ['@vueuse/core', '@mussi/docsearch', 'preact', 'preact/debug'],
    },
    ...{
      ssr: {
        noExternal: ['@mussi/docsearch'],
      },
    } as any,
  },
})
