import { defineApp } from 'iles'
import { title, description } from '~/site'

export default defineApp({
  head: {
    title,
    meta: [
      { property: 'description', content: description },
    ],
  },
  enhanceApp ({ app, head, router }) {
    // Configure the app to add plugins.
  },
})
