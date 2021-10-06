/* eslint-disable import/no-duplicates */
/* eslint-disable import/order */
declare module '*.vue' {
  import { ComponentOptions } from 'vue'
  const comp: ComponentOptions
  export default comp
}

declare module '@siteData' {
  const data: string
  export default data
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
