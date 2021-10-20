import type { DefineComponent, Ref } from 'vue'

declare module '@vue/runtime-core' {
  export interface ComponentCustomProperties {
    $frontmatter: import('iles').PageFrontmatter
    $meta: import('iles').PageMeta
    $site: import('iles').UserSite
  }
}

declare global {
  interface Window {
  }
}
