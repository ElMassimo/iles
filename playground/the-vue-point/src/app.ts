import { defineApp } from 'iles'
import { computed } from 'vue'
import site from '~/site'
import 'virtual:windi.css'
import 'virtual:windi-devtools'
import '~/style.css'

export default defineApp({
  head ({ frontmatter }) {
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
    // Configure the app to add plugins.
  },
})
