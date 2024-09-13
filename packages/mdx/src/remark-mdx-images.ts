import type { MDXJsxFlowElement, MDXJsxTextElement, MDXJsxAttribute, MDXJsxAttributeValueExpression } from 'mdast-util-mdx-jsx'
import type { MDXJSEsm } from 'mdast-util-mdxjs-esm'
import type { Root, Image } from 'mdast'
import type { Plugin } from 'unified'
import type { Parent, Node } from 'unist'
import type { VFile } from 'vfile'
import { visit, SKIP } from 'unist-util-visit'
import type { MarkdownOptions } from './types'

import { isAbsolute, isJsxElement, isString } from './utils'

type ImagePlugin = Plugin<[MarkdownOptions?], Root, Root>

/**
 * A Remark plugin for converting Markdown images to MDX images using imports
 * for the image source.
 */
export const remarkMdxImages: ImagePlugin = options => (ast, vfile) => {
  const imports: MDXJSEsm[] = []
  const imported = new Map<string, string>()

  visit(ast, (node, index, parent) => {
    if (node.type === 'image')
      return replaceMarkdownImage(node, index!, parent!)

    if (isJsxElement(node) && (node.name === 'img' || node.name === 'Img' || node.name === 'Image'))
      return replaceSrcAttribute(node)
  })

  if (imports.length > 0)
    ast.children.unshift(...imports)

  function replaceSrcAttribute (node: MDXJsxTextElement | MDXJsxFlowElement) {
    for (const attr of node.attributes) {
      if (attr.type === 'mdxJsxAttribute' && attr.name === 'src' && isString(attr.value)) {
        const srcExpression = imageSrcToMdxExpression(attr.value)
        if (srcExpression) attr.value = srcExpression
        break
      }
    }
    return SKIP
  }

  function replaceMarkdownImage (node: Image, index: number, parent: Parent) {
    const src = imageSrcToMdxExpression(node.url)

    if (src) {
      const attrs = { alt: node.alt || null, title: node.title, src }
      if (!node.title) delete attrs.title

      const mdxImage: MDXJsxTextElement = {
        type: 'mdxJsxTextElement',
        name: 'img',
        children: [],
        attributes: Object.entries(attrs)
          .map(([name, value]) => ({ type: 'mdxJsxAttribute', name, value })),
      }

      parent!.children.splice(index!, 1, mdxImage)
    }

    return SKIP
  }

  function imageSrcToMdxExpression (url: string): undefined | MDXJsxAttributeValueExpression {
    const name = imageSrcToIdentifier(url)
    if (!name) return
    return {
      type: 'mdxJsxAttributeValueExpression',
      value: name,
      data: {
        estree: {
          type: 'Program',
          sourceType: 'module',
          body: [{ type: 'ExpressionStatement', expression: { type: 'Identifier', name } }],
        },
      },
    }
  }

  function imageSrcToIdentifier (url: string) {
    if (isAbsolute(url)) return

    let name = imported.get(url)
    if (!name) {
      name = `__mdx_image_${imported.size}`
      imported.set(url, name)

      const src = options?.withImageSrc?.(url, vfile) || url

      imports.push({
        type: 'mdxjsEsm',
        value: '_not_used_',
        data: {
          estree: {
            type: 'Program',
            sourceType: 'module',
            body: [
              {
                type: 'ImportDeclaration',
                source: { type: 'Literal', value: src, raw: JSON.stringify(src) },
                specifiers: [
                  {
                    type: 'ImportDefaultSpecifier',
                    local: { type: 'Identifier', name },
                  },
                ],
              },
            ],
          },
        },
      })
    }

    return name
  }
}
