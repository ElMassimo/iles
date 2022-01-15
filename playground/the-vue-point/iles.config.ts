import { defineConfig } from 'iles'

import excerpt from '@islands/excerpt'
import feed from '@islands/feed'
import icons from '@islands/icons'
import images, { hdPreset } from '@islands/images'
import prism from '@islands/prism'

import windicss from 'vite-plugin-windicss'
import inspect from 'vite-plugin-inspect'

const presets = {
  narrow: hdPreset({
    width: 200,
    widths: [200],
    formats: {
      avif: { quality: 44 },
      webp: { quality: 44 },
      jpeg: { quality: 70 },
    }
  }),
  post: hdPreset({
    widths: [440, 758],
    formats: {
      avif: { quality: 44 },
      webp: { quality: 44 },
      jpeg: { quality: 70 },
    }
  })
}

export default defineConfig({
  siteUrl: 'https://the-vue-point-with-iles.netlify.app/',
  turbo: true,
  jsx: 'solid',
  prettyUrls: false,
  svelte: true,
  modules: [
    excerpt(),
    feed(),
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
  },
  vite: {
    plugins: [
      windicss(),
      Boolean(process.env.DEBUG) && inspect(),
    ],
  },
})
