import { createApp as createClientApp, createSSRApp, ref } from 'vue'
import { createMemoryHistory, createRouter as createVueRouter, createWebHistory } from 'vue-router'
import { createHead } from '@vueuse/head'

import routes from '@islands/routes'
import appConfig from '@islands/app-config'
import userApp from '@islands/user-app'

import type { CreateAppFactory, SSGContext, RouterOptions } from '../shared'
import { serialize } from './utils'
import { App, Debug, Island } from './components'
import { installPageData } from './composables/pageData'
import { installAppConfig } from './composables/appConfig'

function newApp () {
  return import.meta.env.SSR ? createSSRApp(App) : createClientApp(App)
}

function transformState (state: any) {
  return import.meta.env.SSR ? serialize(state) : state
}

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

  const app = newApp()

  installAppConfig(app, appConfig)

  const head = createHead()
  app.use(head)

  const router = createRouter({ base, ...routerOptions })
  app.use(router)

  const { frontmatter } = installPageData(app, router.currentRoute)
  Object.defineProperty(app.config.globalProperties, '$frontmatter', {
    get: () => frontmatter.value,
  })

  // Install global components
  app.component('Island', Island)
  app.component('DebugIslands', import.meta.env.SSR ? () => null : Debug)

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
    initialState: {},
    routePath,
  }

  if (!import.meta.env.SSR)
    // @ts-ignore
    context.initialState = transformState(window.__INITIAL_STATE__ || {})

  const { head: headConfig, enhanceApp } = userApp
  if (headConfig) head.addHeadObjs(ref(headConfig))
  if (enhanceApp) await enhanceApp(context)

  let entryRoutePath: string | undefined
  let isFirstRoute = true
  router.beforeEach((to, from, next) => {
    if (isFirstRoute || (entryRoutePath && entryRoutePath === to.path)) {
      // The first route is rendered in the server and its state is provided globally.
      isFirstRoute = false
      entryRoutePath = to.path
      to.meta.state = context.initialState
    }

    next()
  })

  if (import.meta.env.SSR) {
    router.push(context.routePath)

    await router.isReady()
    context.initialState = router.currentRoute.value.meta.state as Record<string, any> || {}
  }

  // serialize initial state for SSR app for it to be interpolated to output HTML
  const initialState = transformState(context.initialState)

  return { ...context, initialState }
}

if (!import.meta.env.SSR) {
  (async () => {
    const { app, router } = await createApp()
    await router.isReady() // wait until page component is fetched before mounting
    app.mount('#app', true)
  })()
}
