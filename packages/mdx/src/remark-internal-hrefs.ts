import type { MdxJsxFlowElement, MdxJsxTextElement } from 'mdast-util-mdx-jsx'
import type { Root } from 'mdast'
import type { Plugin, Transformer } from 'unified'

import { visit, SKIP } from 'unist-util-visit'

import { isJsxElement, isString, toExplicitHtmlPath } from './utils'

export interface HrefOptions {
  prettyUrls?: boolean
}

type HrefPlugin = Plugin<[HrefOptions?], Root, Root>
type HrefProcessor = Transformer<Root, Root>

/**
 * A Remark plugin for converting Markdown images to Mdx images using imports
 * for the image source.
 */
export const remarkInternalHrefs: HrefPlugin = (options) => {
  if (!options?.prettyUrls) return remarkProcessor
}

const remarkProcessor: HrefProcessor = (ast, vfile) => {
  visit(ast, (node) => {
    if (node.type === 'link') {
      const { url } = node
      if (url) node.url = toExplicitHtmlPath(url)
      return SKIP
    }

    if (isJsxElement(node) && (node.name === 'a' || node.name === 'Link')) {
      replaceHrefAttribute(node)
      return SKIP
    }
  })

  function replaceHrefAttribute (node: MdxJsxTextElement | MdxJsxFlowElement) {
    for (const attr of node.attributes) {
      if (attr.type === 'mdxJsxAttribute' && attr.name === 'href') {
        if (isString(attr.value) && attr.value) attr.value = toExplicitHtmlPath(attr.value)
        break
      }
    }
  }
}
