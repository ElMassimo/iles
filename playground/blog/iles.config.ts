import { defineConfig } from 'iles'
import IconsResolver from 'unplugin-icons/resolver'

export default defineConfig({
  debug: true,
  components: {
    resolvers: [IconsResolver({ componentPrefix: '' })],
  },
  pages: {
    extendRoute (route) {
      if (route.path.startsWith('/posts') && route.path !== '/posts')
        return { ...route, meta: { ...route.meta, layout: 'post' } }
    },
  },
  vite: {
    optimizeDeps: { include: ['@vueuse/core', 'feed'] },
  },
})
