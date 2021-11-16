import type { CompileOptions } from 'xdm/lib/integration/rollup.js'
import type { Plugin } from 'vite'
import type { FrontmatterOptions } from '@islands/frontmatter'
import type { Pluggable } from 'unified'

export type PluginLike = null | undefined | false | Pluggable
export type PluginOption = PluginLike | Promise<PluginLike> | string | [string, any]

interface Options extends FrontmatterOptions {
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
}

export type MarkdownOptions = Omit<CompileOptions, 'remarkPlugins' | 'rehypePlugins' | 'recmaPlugins'> & Options
