import 'vue-router'

declare module 'vue-router' {
  interface RouteMeta {
    frontmatter?: Record<string, any>
    layout?: string
    extension?: string
  }
}
