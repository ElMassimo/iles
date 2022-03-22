import type { CompileOptions } from '@mdx-js/mdx'
import type { Plugin } from 'vite'
import type { Pluggable } from 'unified'
import type { VFile } from 'vfile'

export type PluginLike = null | undefined | false | Pluggable
export type PluginOption = PluginLike | Promise<PluginLike> | string | [string, any]

import type { MDXFlowExpression } from 'mdast-util-mdx-expression'

declare module 'hast' {
  interface RootContentMap {
    mdxFlowExpression: MDXFlowExpression
  }

  interface ElementContentMap {
    mdxFlowExpression: MDXFlowExpression
  }
}

export interface MarkdownOptions extends Omit<CompileOptions, 'remarkPlugins' | 'rehypePlugins' | 'recmaPlugins'> {
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

  /**
   * Built-in tags that should not be optimized as HTML.
   */
  overrideElements?: string[]
}
