import type { IlesModule } from 'iles'
import type { ExcerptOptions, Options, SeparatorFn } from './types'
import { recmaPlugin } from './recma-plugin'
import { rehypePlugin } from './rehype-plugin'

declare module 'iles' {
  interface PageMeta {
    /**
     * Excerpt for MDX documents.
     */
    excerpt?: string
  }
}

export * from './types'

/**
 * An iles module that sets `meta.excerpt` for MDX documents.
 * Also enables an `excerpt: true` prop in MDX components to render HTML.
 */
export default function IlesExcerpts (userOptions: ExcerptOptions = {}): IlesModule {
  const { separator = ['excerpt', 'Excerpt'], ...rest } = userOptions
  const options: Options = { ...rest, isSeparator: separatorFnFrom(separator) }

  return {
    name: '@islands/excerpt',
    markdown: {
      rehypePlugins: [
        [rehypePlugin, options],
      ],
      recmaPlugins: [
        recmaPlugin,
      ],
    },
  }
}

function separatorFnFrom (separator: string | string[] | SeparatorFn): SeparatorFn {
  if (isSeparatorFn(separator))
    return separator

  const separators = new Set(Array.isArray(separator) ? separator : [separator])

  return (node) => {
    if (node.type === 'element') return separators.has(node.tagName)
    // @ts-ignore
    if (node.type === 'mdxJsxFlowElement') return separators.has(node.name)
    if (node.type === 'comment') return separators.has(node.value.trim())
    return false
  }
}

function isSeparatorFn (val: any): val is SeparatorFn {
  return typeof val === 'function'
}
