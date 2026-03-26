import { defineApp } from 'iles'

import 'virtual:uno.css'
import '@unocss/reset/tailwind-compat.css'
import '~/style.css'
import 'prismjs/themes/prism-tomorrow.css'

export default defineApp({
  enhanceApp({ app, head, router }) {
    // Configure the Vue app
  },
})
