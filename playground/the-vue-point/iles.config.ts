import { defineConfig } from 'iles'

import excerpt from '@islands/excerpt'
import feed from '@islands/feed'
import headings from '@islands/headings'
import icons from '@islands/icons'
import images, { hdPreset } from '@islands/images'
import prism from '@islands/prism'
import reactivityTransform from '@vue-macros/reactivity-transform/vite'

import UnoCSS from 'unocss/vite'
import inspect from 'vite-plugin-inspect'

const presets = {
  narrow: hdPreset({
    width: 200,
    widths: [200],
    formats: {
      avif: { quality: 44 },
      webp: { quality: 44 },
      original: {},
    },
  }),
  post: hdPreset({
    widths: [440, 758],
    formats: {
      avif: { quality: 44 },
      webp: { quality: 44 },
      original: {},
    },
  }),
}

export default defineConfig({
  siteUrl: 'https://the-vue-point-with-iles.netlify.app/',
  turbo: true,
  jsx: 'solid',
  prettyUrls: false,
  svelte: true,
  modules: [
    excerpt({ separator: ['hr', 'h2', 'excerpt', 'Excerpt'] }),
    feed(),
    headings(),
    icons(),
    prism(),
    images(presets),
  ],
  // Example: Configure all posts to use a different layout without having to
  // add `layout: 'post'` in every file.
  extendFrontmatter (frontmatter, filename) {
    if (filename.includes('/posts/'))
      frontmatter.layout ||= 'post'
  },
  markdown: {
    withImageSrc (src) {
      if (!src.includes('?'))
        return `${src}?preset=post`
    },
    remarkPlugins: ['remark-gfm'],
  },
  vite: {
    plugins: [
      reactivityTransform(),
      UnoCSS(),
      Boolean(process.env.DEBUG) && inspect(),
    ],
  },
})
