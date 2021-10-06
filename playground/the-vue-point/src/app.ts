import { defineApp } from 'iles'
import { computed } from 'vue'

import 'virtual:windi.css'
import 'virtual:windi-devtools'
import '~/style.css'

export default defineApp({
  head ({ frontmatter, site }) {
    const title = computed(() => frontmatter.value.title
      ? `${frontmatter.value.title} · ${site.title}`
      : site.title)

    const description = computed(() =>
      frontmatter.value.description || site.description)

    return {
      title,
      meta: [
        { name: 'description', content: description },
      ],
    }
  },
  enhanceApp ({ app, head, router }) {
  },
})
