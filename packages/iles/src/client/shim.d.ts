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

declare module '@islands/layouts' {
  import type { getLayout } from './app/layouts'
  export { getLayout }
}

declare module '@islands/app-config' {
  import type { AppClientConfig } from './shared'
  const config: AppClientConfig
  export default config
}

declare module '@islands/user-app' {
  import type { UserApp } from './shared'
  const config: UserApp
  export default config
}

declare module 'vite-plugin-xdm/frontmatter' {
  import type { FrontmatterPlugin } from 'vite-plugin-xdm'
  const plugin: FrontmatterPlugin
  export default plugin
}
