/* eslint-disable import/no-duplicates */

/// <reference types="vue/ref-macros" />
/// <reference types="vite/client" />
/// <reference types="@peeky/runner" />
/// <reference types="vite-plugin-pages/client" />

declare interface Window {
}

// with vite-plugin-md, markdowns can be treat as Vue components
declare module '*.md' {
  import { ComponentOptions } from 'vue'
  const component: ComponentOptions
  export default component
}

declare module '*.vue' {
  import { ComponentOptions } from 'vue'
  const component: ComponentOptions
  export default component
}

declare module 'vite-plugin-xdm' {
  import XdmPlugin from 'xdm/rollup.js'
  import { Plugin } from 'vite'

  type PluginOptions = Parameters<typeof XdmPlugin>[0]
  function VitePluginXDM(options?: PluginOptions): Plugin

  export { PluginOptions, VitePluginXDM as default }
}
