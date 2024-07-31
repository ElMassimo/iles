declare module '*.vue' {
  const comp: import('./shared').PageComponent
  export default comp
}

declare module '*.mdx' {
  const comp: import('./shared').PageComponent
  export default comp
}

declare module '@islands/routes' {
  import type { RouteRecordRaw } from 'vue-router'

  const routes: RouteRecordRaw[]
  export default routes
}

declare module '@islands/app-config' {
  const config: import('./shared').AppClientConfig
  export default config
}

declare module '@islands/user-app' {
  const config: import('./shared').UserApp
  export default config
}

declare module '@islands/user-site' {
  const config: import('vue').Ref<import('./shared').UserSite>
  export default config
}

declare module '@islands/components/NotFound' {
  const component: import('vue').Component
  export default component
}
