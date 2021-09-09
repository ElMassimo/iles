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

declare module '@islands/enhance' {
  import type { SSGContext } from '../../types/shared'
  const enhance: (ctx: SSGContext) => void
  export default enhance
}
