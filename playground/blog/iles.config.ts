import { defineConfig } from 'iles'

const title = 'Îles'

export default defineConfig({
  title,
  description: 'A static site generator for islands architecture.',
  head: {
    meta: [
      { property: 'og:title', content: title },
    ],
    script: [
      { type: 'module', children: 'console.log("Yeah!")' },
    ],
  },
})
