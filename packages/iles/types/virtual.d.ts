/* eslint-disable import/no-duplicates */
/* eslint-disable import/order */
declare module '*.vue' {
  import { ComponentOptions } from 'vue'
  const comp: ComponentOptions
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

declare module '@islands/hydration/preact' {
  const prerender: import('@islands/hydration').PrerenderFn
  export { prerender }
}

declare module '@islands/hydration/svelte' {
  const prerender: import('@islands/hydration').PrerenderFn
  export { prerender }
}

declare module '@islands/hydration/solid' {
  const prerender: import('@islands/hydration').PrerenderFn
  export { prerender }
}
