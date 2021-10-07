import 'vue-router'

declare module 'vue-router' {
  interface RouteMeta {
    filename: string
    layout?: import('vue').Ref<import('vue').DefineComponent | false>
  }
}
