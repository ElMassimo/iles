import { defineConfig } from 'iles'

import iconsResolver from 'unplugin-icons/resolver'

import icons from 'unplugin-icons/vite'
import windicss from 'vite-plugin-windicss'
import inspect from 'vite-plugin-inspect'
import solid from 'vite-plugin-solid'

export default defineConfig({
  siteUrl: 'https://the-vue-point-with-iles.netlify.app/',
  components: {
    resolvers: [iconsResolver({ componentPrefix: '' })],
  },
  markdown: {
    rehypePlugins: [
      ['@mapbox/rehype-prism', { alias: { markup: ['html', 'vue'] } }],
    ],
    // Example: Configure all posts to use a different layout without having to
    // add `layout: 'post'` in every file.
    extendFrontmatter (frontmatter, filename) {
      if (filename.includes('/posts/'))
        return { layout: 'post', ...frontmatter }
    },
  },
  vite: {
    plugins: [
      icons({ autoInstall: true }),
      windicss(),
      solid({ ssr: true }),
      Boolean(process.env.DEBUG) && inspect(),
    ],
  },
})
