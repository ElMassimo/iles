import { createApp as createClientApp, createSSRApp } from 'vue'
import { createMemoryHistory, createRouter as createVueRouter, createWebHistory } from 'vue-router'
import { createHead } from '@vueuse/head'
import routes from '@islands/routes'
import enhance from '@islands/enhance'
import type { CreateAppFactory, SSGContext, RouterOptions } from '../../../types/shared'
import { serialize, inBrowser } from './utils'
import { App, Debug, Island, PageContent } from './components'
// import { siteDataRef, useData, dataSymbol, initData } from './data'

function newApp () {
  return import.meta.env.SSR ? createSSRApp(App) : createClientApp(App)
}

function transformState (state: any) {
  return import.meta.env.SSR ? serialize(state) : state
}

function createRouter ({ base, ...routerOptions }: RouterOptions) {
  return createVueRouter({
    routes,
    history: inBrowser ? createWebHistory(base) : createMemoryHistory(base),
    ...routerOptions,
  })
}

export const createApp: CreateAppFactory = async ({ inBrowser, routePath }) => {
  const app = newApp()

  const head = createHead()
  app.use(head)

  // TODO: Take routerOptions.
  const base = '/'
  const router = createRouter({ base })
  app.use(router)

  // Install global components
  app.component('PageContent', PageContent)
  app.component('Island', Island)
  app.component('Debug', inBrowser ? Debug : () => null)

  // TODO: Provide frontmatter
  // const data = initData(router.route)
  // app.provide(dataSymbol, data)

  // // expose $frontmatter
  // Object.defineProperty(app.config.globalProperties, '$frontmatter', {
  //   get() {
  //     return data.frontmatter.value
  //   }
  // })

  const context: SSGContext = {
    app,
    head,
    inBrowser,
    router,
    routes,
    initialState: {},
    routePath,
  }

  if (import.meta.env.SSR)
    // @ts-ignore
    context.initialState = transformState(window.__INITIAL_STATE__ || {})

  await enhance(context)

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

  if (!inBrowser) {
    const route = context.routePath ?? base ?? '/'
    router.push(route)

    await router.isReady()
    context.initialState = router.currentRoute.value.meta.state as Record<string, any> || {}
  }

  // serialize initial state for SSR app for it to be interpolated to output HTML
  const initialState = transformState(context.initialState)

  return { ...context, initialState } as SSGContext
}

if (inBrowser) {
  (async () => {
    const { app, router } = await createApp({ inBrowser: true })
    await router.isReady() // wait until page component is fetched before mounting
    app.mount('#app', true)
  })()
}
