import { createApp as createClientApp, createSSRApp, ref } from 'vue'
import { createMemoryHistory, createRouter as createVueRouter, createWebHistory } from 'vue-router'
import { createHead } from '@vueuse/head'

import routes from '@islands/routes'
import appConfig from '@islands/app-config'
import userApp from '@islands/user-app'
import type { CreateAppFactory, SSGContext, RouterOptions } from '../shared'
import { App, Island } from './components'
import { installPageData } from './composables/pageData'
import { installAppConfig } from './composables/appConfig'

const newApp = import.meta.env.SSR ? createSSRApp : createClientApp

function createRouter ({ base, ...routerOptions }: Partial<RouterOptions>) {
  if (base === '/') base = undefined
  return createVueRouter({
    ...routerOptions,
    routes,
    history: import.meta.env.SSR ? createMemoryHistory(base) : createWebHistory(base),
  })
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

  const { frontmatter } = installPageData(app, router.currentRoute)
  Object.defineProperty(app.config.globalProperties, '$frontmatter', {
    get: () => frontmatter.value,
  })

  // Install global components
  app.component('Island', Island)

  // Default meta tags
  head.addHeadObjs(ref({
    meta: [
      { charset: 'UTF-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1.0' },
    ],
  }))

  const context: SSGContext = {
    app,
    head,
    router,
    routes,
    routePath,
  }

  // Apply any configuration added by the user in app.ts
  const { head: headConfig, enhanceApp } = userApp
  if (headConfig) head.addHeadObjs(ref(headConfig))
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
