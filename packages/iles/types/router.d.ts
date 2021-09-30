import 'vue-router'

declare module 'vue-router' {
  interface RouteMeta {
    filename: string
  }
}

declare global {
  interface Window {
    __INITIAL_STATE__?: Record<string, any>
  }
}
