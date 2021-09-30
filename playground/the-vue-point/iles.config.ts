import { defineConfig } from 'iles'

import iconsResolver from 'unplugin-icons/resolver'

import icons from 'unplugin-icons/vite'
import windicss from 'vite-plugin-windicss'
import inspect from 'vite-plugin-inspect'
import rehypePrism from './src/markdown/prism'

export default defineConfig({
  siteUrl: 'https://vue-iles.netlify.app',
  components: {
    resolvers: [iconsResolver({ componentPrefix: '' })],
  },
  markdown: {
    rehypePlugins: [rehypePrism()],
    extendFrontmatter (frontmatter, filename) {
      if (filename.includes('/posts/'))
        return { layout: 'post', ...frontmatter }
    },
  },
  vite: {
    optimizeDeps: {
      include: ['quicklink'],
    },
    plugins: [
      icons(),
      windicss(),
      Boolean(process.env.DEBUG) && inspect(),
    ],
  },
})
