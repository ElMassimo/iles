import type { MDXJsxFlowElement, MDXJsxTextElement, MDXJsxAttribute, MDXJsxAttributeValueExpression } from 'mdast-util-mdx-jsx'
import type { MDXJSEsm } from 'mdast-util-mdxjs-esm'
import type { Image } from 'mdast'
import type { Plugin } from 'unified'
import type { Parent, Node } from 'unist'

import { visit, SKIP } from 'unist-util-visit'

const urlPattern = /^(https?:)?\//

/**
 * A Remark plugin for converting Markdown images to MDX images using imports
 * for the image source.
 */
export const remarkMdxImages = () => (ast: Parent) => {
  const imports: Omit<MDXJSEsm, 'value'>[] = []
  const imported = new Map<string, string>()

  visit(ast, (node, index, parent) => {
    if (node.type === 'image')
      return replaceMarkdownImage(node as Image, index!, parent!)

    if (isJsxElement(node) && node.name === 'img')
      return replaceSrcAttribute(node)
  })

  if (imports.length > 0)
    ast.children.unshift(...imports)

  function replaceSrcAttribute (node: MDXJsxFlowElement) {
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
    if (urlPattern.test(url)) return

    let name = imported.get(url)
    if (!name) {
      name = `__mdx_image_${imported.size}`
      imported.set(url, name)
      imports.push({
        type: 'mdxjsEsm',
        data: {
          estree: {
            type: 'Program',
            sourceType: 'module',
            body: [
              {
                type: 'ImportDeclaration',
                source: { type: 'Literal', value: url, raw: JSON.stringify(url) },
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

function isJsxElement (node: Node): node is MDXJsxFlowElement {
  return node.type === 'mdxJsxFlowElement'
}

function isString (val: any): val is string {
  return typeof val === 'string'
}
