import { defineConfig } from 'iles'

import windicss from 'vite-plugin-windicss'
import inspect from 'vite-plugin-inspect'

export default defineConfig({
  siteUrl: 'https://the-vue-point-with-iles.netlify.app/',
  jsx: 'solid',
  prettyUrls: false,
  svelte: true,
  modules: [
    '@islands/icons',
    '@islands/prism',
    '@islands/feed'
  ],
  // Example: Configure all posts to use a different layout without having to
  // add `layout: 'post'` in every file.
  extendFrontmatter (frontmatter, filename) {
    if (filename.includes('/posts/'))
      frontmatter.layout ||= 'post'
  },
  vite: {
    plugins: [
      windicss(),
      Boolean(process.env.DEBUG) && inspect(),
    ],
  },
})
