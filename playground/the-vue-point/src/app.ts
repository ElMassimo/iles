import { defineApp } from 'iles'
import { computed } from 'vue'
import * as Site from '~/site'

export default defineApp({
  head ({ frontmatter }) {
    const title = computed(() => frontmatter.value.title
      ? `${frontmatter.value.title} · ${Site.title}`
      : Site.title)

    const description = computed(() =>
      frontmatter.value.description || Site.description)

    return {
      title,
      meta: [
        { property: 'description', content: description },
      ],
    }
  },
  enhanceApp ({ app, head, router }) {
    // Configure the app to add plugins.
  },
})
