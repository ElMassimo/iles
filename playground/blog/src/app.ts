import { defineApp } from 'iles'

const title = 'Îles'

export default defineApp({
  head: {
    title,
    meta: [
      { property: 'description', content: 'A static site generator for islands architecture.' },
      { property: 'og:title', content: title },
    ],
    script: [
      { type: 'module', children: 'console.log("Yeah!")' },
    ],
  },
})
