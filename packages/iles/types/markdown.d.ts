import type { CompileOptions } from 'xdm/lib/integration/rollup.js'
import type { Plugin } from 'vite'
import type { FrontmatterOptions } from '@islands/frontmatter'

interface Options extends FrontmatterOptions {
  /**
   * Remark plugins that should be used to process files.
   */
  remarkPlugins?: PluginOption[]

  /**
   * Rehype plugins that should be used to process files.
   */
  rehypePlugins?: PluginOption[]
}

export type MarkdownOptions = Omit<CompileOptions, 'remarkPlugins' | 'rehypePlugins'> & Options

export type MarkdownProcessor = ReturnType<typeof import('xdm/lib/util/create-format-aware-processors.js').createFormatAwareProcessors>

export type MarkdownPlugin = (options?: MarkdownOptions) => Plugin & { api: MarkdownProcessor }
