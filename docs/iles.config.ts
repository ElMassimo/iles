import { resolve } from 'path'
import { defineConfig } from 'iles'

import headings from '@islands/headings'
import icons from '@islands/icons'
import prism from '@islands/prism'

import windicss from 'vite-plugin-windicss'
import inspect from 'vite-plugin-inspect'
import lastUpdated from './modules/lastUpdated'

export default defineConfig({
  siteUrl: 'https://iles-docs.netlify.app',
  turbo: true,
  jsx: 'preact',
  debug: false,
  modules: [
    headings(),
    icons(),
    prism(),
    lastUpdated(),
  ],
  markdown: {
    rehypePlugins: [
      'rehype-external-links',
    ],
  },
  ssg: {
    manualChunks (id, api) {
      if (id.includes('preact') || id.includes('algolia') || id.toLowerCase().includes('docsearch'))
        return 'docsearch'
    },
  },
  vite: {
    build: {
      cssCodeSplit: false,
    },
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
