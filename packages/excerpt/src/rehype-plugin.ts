import type { IlesModule } from 'iles'
import type { Element } from 'hast'
import type { Plugin } from 'unified'
import { toString } from 'hast-util-to-string'
import type { Options, SeparatorFn } from './types'

/**
 * A rehype plugin to extract an excerpt from the document, adding `excerpt` to
 * the document `meta`.
 *
 * @param options - Options to configure excerpt generation.
 */
export const rehypePlugin: Plugin<[Options], Element> = ({ extract, isSeparator, maxLength }) => (ast, vfile) => {
  const { children } = ast

  let excerpt = extract?.(vfile.value as string, vfile)

  if (excerpt === undefined) {
    let separatorIndex = children.findIndex(isSeparator)

    // Take until the first paragraph if no separator was found.
    if (separatorIndex === -1)
      separatorIndex = children.findIndex(node => node.type === 'element' && node.tagName === 'p') + 1

    // Ensure only one element is used if no paragraph was found.
    if (separatorIndex <= 1)
      separatorIndex = 1

    // Ignore the title for the excerpt.
    const excerptElements = children.slice(0, separatorIndex)
      .filter(el => el.type !== 'element' || el.tagName !== 'h1')

    // Convert the elements of the excerpt to plain text.
    excerpt = toString({ type: 'element', tagName: 'div', children: excerptElements, properties: {} })

    // Add marker for the recma plugin to split the excerpt and content.
    const separator = children[separatorIndex]
    children.splice(separatorIndex,
      // @ts-ignore replace <Excerpt/> with an `excerpt` HTML element
      separator?.type === 'mdxJsxFlowElement' ? 1 : 0,
      { type: 'element', tagName: 'excerpt', children: [], properties: {} })
  }

  if (maxLength && excerpt.length > maxLength)
    excerpt = `${excerpt.slice(0, maxLength - 1)}…`

  // The @islands/mdx plugin will expose all data in `meta`.
  vfile.data.excerpt = excerpt
}
