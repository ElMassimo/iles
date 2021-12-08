import type { CompileOptions } from 'xdm/lib/integration/rollup.js'
import type { Plugin } from 'vite'
import type { Pluggable } from 'unified'
import type { VFile } from 'vfile'

export type PluginLike = null | undefined | false | Pluggable
export type PluginOption = PluginLike | Promise<PluginLike> | string | [string, any]

type XdmOptions = Omit<CompileOptions, 'remarkPlugins' | 'rehypePlugins' | 'recmaPlugins'>

export interface MarkdownOptions extends XdmOptions {
  /**
   * Recma plugins that should be used to process files.
   */
  recmaPlugins?: PluginOption[]

  /**
   * Remark plugins that should be used to process files.
   */
  remarkPlugins?: PluginOption[]

  /**
   * Rehype plugins that should be used to process files.
   */
  rehypePlugins?: PluginOption[]

  /**
   * Allows to modify an image src. Useful to customize image processing using
   * `vite-imagetools` or other rollup plugins.
   */
  withImageSrc?: (src: string, file: VFile) => string | void
}
