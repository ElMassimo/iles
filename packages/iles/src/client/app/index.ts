import { createApp as createClientApp, createSSRApp, ref } from 'vue'
import { createMemoryHistory, createRouter as createVueRouter, createWebHistory } from 'vue-router'
import { createHead } from '@vueuse/head'

import routes from '@islands/routes'
// import userConfig from '@islands/user-config'

import type { CreateAppFactory, SSGContext, RouterOptions } from '../shared'
import { serialize, inBrowser } from './utils'
import { App, Debug, Island, PageContent } from './components'
import { installPageData } from './pageData'

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
  app.component('DebugIslands', inBrowser ? Debug : () => null)

  const { frontmatter } = installPageData(app, router.currentRoute)

  Object.defineProperty(app.config.globalProperties, '$frontmatter', {
    get: () => frontmatter.value,
  })

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

  // const { title, description, head: headConfig, enhanceApp } = userConfig

  // head.addHeadObjs(ref({
  //   title,
  //   meta: [{ name: 'description', content: description }],
  // }))

  // if (headConfig)
  //   head.addHeadObjs(ref(userConfig.head))

  // if (enhanceApp)
  //   await enhanceApp(context)

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
