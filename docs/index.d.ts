/// <reference types="vite/client" />
/// <reference types="vue/ref-macros" />

import type { Heading } from '@islands/headings'

declare module 'iles' {
  export interface PageMeta {
    headings?: Heading[]
  }
}
