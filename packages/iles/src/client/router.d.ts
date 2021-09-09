import 'vue-router'

declare module 'vue-router' {
  interface RouteMeta {
    relativePath: string
    title: string
    description: string
    headers: Header[]
    frontmatter: Record<string, any>
    lastUpdated: number
    layout: string
  }
}
