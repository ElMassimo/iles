import { defineConfig } from 'iles'

import iconsResolver from 'unplugin-icons/resolver'

import icons from 'unplugin-icons/vite'
import windicss from 'vite-plugin-windicss'
import inspect from 'vite-plugin-inspect'

export default defineConfig({
  siteUrl: 'https://vue-iles.netlify.app',
  components: {
    resolvers: [iconsResolver({ componentPrefix: '' })],
  },
  markdown: {
    rehypePlugins: [
      ['@mapbox/rehype-prism', { alias: { markup: ['html', 'vue'] } }],
    ],
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
      icons({ autoInstall: true }),
      windicss(),
      Boolean(process.env.DEBUG) && inspect(),
    ],
  },
})
