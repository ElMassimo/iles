import { createApp as createClientApp, createSSRApp, ref } from 'vue'
import { createMemoryHistory, createRouter as createVueRouter, createWebHistory } from 'vue-router'
import { createHead } from '@vueuse/head'

import routes from '@islands/routes'
import appConfig from '@islands/app-config'
import userApp from '@islands/user-app'
import type { CreateAppFactory, SSGContext, RouterOptions } from '../shared'
import App from './components/App.vue'
import { installPageData } from './composables/pageData'
import { installAppConfig } from './composables/appConfig'

const newApp = import.meta.env.SSR ? createSSRApp : createClientApp

function createRouter ({ base, ...routerOptions }: Partial<RouterOptions>) {
  if (base === '/') base = undefined
  return createVueRouter({
    scrollBehavior: () => ({ top: 0 }),
    ...routerOptions,
    routes,
    history: import.meta.env.SSR ? createMemoryHistory(base) : createWebHistory(base),
  })
}

function notEmpty<T> (val: T | boolean | undefined | null): val is T {
  return Boolean(val)
}

export const createApp: CreateAppFactory = async (options = {}) => {
  const { base, router: routerOptions } = appConfig
  const { routePath = base } = options

  const app = newApp(App)

  installAppConfig(app, appConfig)

  const head = createHead()
  app.use(head)

  const router = createRouter({ base, ...routerOptions })
  app.use(router)
  // Set the path that should be rendered.
  if (import.meta.env.SSR) {
    router.push(routePath)
    await router.isReady()
  }

  const route = router.currentRoute
  const { frontmatter } = installPageData(app, route)
  Object.defineProperty(app.config.globalProperties, '$frontmatter', {
    get: () => frontmatter.value,
  })

  // Default meta tags
  head.addHeadObjs(ref({
    meta: [
      { charset: 'UTF-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1.0' },
    ],
    link: [
      appConfig.ssg.sitemap && { rel: 'sitemap', href: `${base}sitemap.xml` },
    ].filter(notEmpty),
  }))

  const context: SSGContext = {
    app,
    head,
    frontmatter,
    route,
    router,
    routes,
    routePath,
  }

  // Apply any configuration added by the user in app.ts
  const { head: headConfig, enhanceApp } = userApp
  if (headConfig) head.addHeadObjs(ref(typeof headConfig === 'function' ? headConfig(context) : headConfig))
  if (enhanceApp) await enhanceApp(context)

  return context
}

if (!import.meta.env.SSR) {
  (async () => {
    const { app, router } = await createApp()

    const devtools = await import('./composables/devtools')
    devtools.installDevtools(app, appConfig)

    await router.isReady() // wait until page component is fetched before mounting
    app.mount('#app', true)
  })()
}
