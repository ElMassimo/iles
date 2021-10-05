import 'vue-router'
import type { DefineComponent, Ref } from 'vue'

declare module 'vue-router' {

  interface RouteMeta {
    filename: string
    layout?: Ref<DefineComponent | false>
  }
}

declare global {
  interface Window {
    __INITIAL_STATE__?: Record<string, any>
  }
}
