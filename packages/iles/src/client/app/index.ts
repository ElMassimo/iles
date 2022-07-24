import { createApp as createClientApp, createSSRApp, ref } from 'vue'
import { createMemoryHistory, createRouter as createVueRouter, createWebHistory } from 'vue-router'
import { createHead } from '@vueuse/head'

import routes from '@islands/routes'
import config from '@islands/app-config'
import userApp from '@islands/user-app'
import siteRef from '@islands/user-site'
import type { CreateAppFactory, AppContext, RouterOptions } from '../shared'
import App from './components/App.vue'
import { installPageData, forcePageUpdate } from './composables/pageData'
import { installMDXComponents } from './composables/mdxComponents'
import { installAppConfig } from './composables/appConfig'
import { resetHydrationId } from './hydration'
import { defaultHead } from './head'
import { resolveLayout } from './layout'
import { resolveProps } from './props'

const newApp = import.meta.env.DEV ? createClientApp : createSSRApp

function createRouter (base: string | undefined, routerOptions: Partial<RouterOptions>) {
  if (base === '/') base = undefined

  return createVueRouter({
    scrollBehavior: (current, previous, savedPosition) => {
      if (savedPosition) return savedPosition
      if (current.path !== previous.path && !current.hash) return { top: 0 }
      if (current.hash) return { top: document.querySelector<HTMLElement>(current.hash)?.offsetTop || 0 }
    },
    ...routerOptions,
    routes,
    history: import.meta.env.SSR ? createMemoryHistory(base) : createWebHistory(base),
  })
}

export const createApp: CreateAppFactory = async (options = {}) => {
  const { head: headConfig, enhanceApp, router: routerOptions } = userApp
  const { routePath = config.base, ssrProps } = options

  const app = newApp(App)

  installAppConfig(app, config)

  const head = createHead()
  app.use(head)

  const router = createRouter(config.base, routerOptions)
  app.use(router)
  router.beforeResolve(resolveLayout)
  router.beforeResolve(async route => await resolveProps(route, ssrProps))

  // Set the path that should be rendered.
  if (import.meta.env.SSR) {
    router.push(routePath)
    await router.isReady()
  }

  const { frontmatter, meta, page, props, route, site } = installPageData(app, siteRef)
  Object.defineProperty(app.config.globalProperties, '$frontmatter', { get: () => frontmatter })
  Object.defineProperty(app.config.globalProperties, '$meta', { get: () => meta })
  Object.defineProperty(app.config.globalProperties, '$site', { get: () => site })

  const context: AppContext = {
    app,
    config,
    head,
    frontmatter,
    meta,
    props,
    site,
    page,
    route,
    router,
    routes,
  }
  head.addHeadObjs(ref(defaultHead(context, userApp.socialTags)))

  // Apply any configuration added by the user in app.ts
  if (headConfig) head.addHeadObjs(ref(typeof headConfig === 'function' ? headConfig(context) : headConfig))
  if (enhanceApp) await enhanceApp(context)
  await installMDXComponents(context, userApp)

  return context
}

if (!import.meta.env.SSR) {
  (async () => {
    const { app, router } = await createApp()

    const devtools = await import('./composables/devtools')
    devtools.installDevtools(app as any, config)
    Object.assign(window, { __ILES_PAGE_UPDATE__: forcePageUpdate })

    router.afterEach(resetHydrationId) // reset island identifiers to match ssg.
    await router.isReady() // wait until page component is fetched before mounting
    app.mount('#app')
  })()
}
