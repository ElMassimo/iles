import { defineConfig } from 'iles'
import IconsResolver from 'unplugin-icons/resolver'
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
  components: {
    resolvers: [IconsResolver({ componentPrefix: '' })],
  },
  pages: {
    extendRoute (route) {
      if (route.path.startsWith('/posts'))
        return { ...route, meta: { ...route.meta, layout: 'post' } }
    },
  },
})
