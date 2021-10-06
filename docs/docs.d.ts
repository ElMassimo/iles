/// <reference types="vite/client" />

declare module '@vue/runtime-core' {
  export interface ComponentCustomProperties {
    $frontmatter: import('iles').PageFrontmatter
  }
}
