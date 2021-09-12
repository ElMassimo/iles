import { defineConfig } from 'iles'

import iconsResolver from 'unplugin-icons/resolver'

import icons from 'unplugin-icons/vite'
import windicss from 'vite-plugin-windicss'
import inspect from 'vite-plugin-inspect'
import restart from 'vite-plugin-restart'

export default defineConfig({
  head: {
    title: 'The Vue Point',
    meta: [
      { property: 'description', content: 'The offical blog for the Vue.js project' },
    ],
    link: [
      { rel: 'icon', href: '/favicon.ico', type: 'image/x-icon' },
    ],
  },
  components: {
    resolvers: [iconsResolver({ componentPrefix: '' })],
  },
  pages: {
    extendRoute (route) {
      if (route.path.startsWith('/posts') && route.path !== '/posts')
        return { ...route, meta: { ...route.meta, layout: 'post' } }
    },
  },
  vite: {
    plugins: [
      icons(),
      windicss(),
      inspect(),
      restart({
        restart: '../../packages/iles/dist/**/*.{ts,js}',
      }),
    ],
  },
})
