import type { DefineComponent, Ref } from 'vue'

declare module '@vue/runtime-core' {
  export interface ComponentCustomProperties {
    $frontmatter: PageFrontmatter
    $meta: PageMeta
    $site: UserSite
  }
}

declare global {
  interface Window {
  }
}
