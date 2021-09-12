import 'vue-router'

declare module 'vue-router' {
  interface RouteMeta {
    filename?: string
    extension?: string
    permalink?: string
    frontmatter?: Record<string, any>
    layout?: string
  }
}
