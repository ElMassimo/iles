/// <reference types="vite/client" />
/// <reference types="vue/ref-macros" />

import type { Header } from '@islands/headers'

declare module 'iles' {
  export interface PageMeta {
    headers?: Header[]
  }
}
