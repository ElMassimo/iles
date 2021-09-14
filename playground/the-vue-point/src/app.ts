import { defineApp } from 'iles'

export default defineApp({
  head: {
    title: 'The Vue Point',
    meta: [
      { property: 'description', content: 'Updates, tips & opinions from the maintainers of Vue.js.' },
    ],
  },
  enhanceApp ({ app, head, router }) {
    // Configure the app to add plugins.
  },
})
