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
import { resetHydrationId } from './hydration'
import { resolveLayout } from './layout'

const newApp = import.meta.env.SSR ? createSSRApp : createClientApp

function createRouter ({ base, ...routerOptions }: Partial<RouterOptions>) {
  if (base === '/') base = undefined

  // Handle 404s in development.
  if (import.meta.env.DEV)
    // @ts-ignore
    routes.push({ path: '/:pathMatch(.*)*', name: 'NotFound', component: () => import('@islands/components/NotFound') })

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
  router.beforeResolve(resolveLayout)

  // Set the path that should be rendered.
  if (import.meta.env.SSR) {
    router.push(routePath)
    await router.isReady()
  }

  const { frontmatter, meta, page, route } = installPageData(app, router.currentRoute)
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
    meta,
    page,
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
    const { app, router, route } = await createApp()

    const devtools = await import('./composables/devtools')
    devtools.installDevtools(app, appConfig)

    router.afterEach(resetHydrationId) // reset island identifiers to match ssg.
    await router.isReady() // wait until page component is fetched before mounting
    app.mount('#app', true)

    Object.assign(window, { __ILES_APP__: app, __ILES_ROUTE__: route })
  })()
}
