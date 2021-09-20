import type { Node } from 'unist'
import visit from 'unist-util-visit'
import type { MDXJsxFlowElement, MDXJsxAttribute, MDXJsxExpressionAttribute } from 'mdast-util-mdx-jsx'

export default () => (ast: any) => {
  visit(ast, (node) => {
    if (isJsxElement(node) && node.attributes.some(hasClientDirective))
      wrapWithIsland(node)
  })
}

function isJsxElement (node: Node): node is MDXJsxFlowElement {
  return node.type === 'mdxJsxFlowElement'
}

function hasClientDirective (attr: MDXJsxAttribute | MDXJsxExpressionAttribute) {
  return 'name' in attr && attr.name.startsWith('client:')
}

// Internal: Replaces the JSX element with an Island, and sets an attribute to
// enable future resolution.
function wrapWithIsland (node: MDXJsxFlowElement) {
  const { name } = node
  node.name = 'Island'
  node.attributes.unshift(
    {
      type: 'mdxJsxAttribute',
      name: 'componentName',
      value: name,
    } as MDXJsxAttribute,
    {
      type: 'mdxJsxAttribute',
      name: '__viteIslandComponent',
      value: {
        type: 'mdxJsxAttributeValueExpression',
        value: `_resolveComponent("${name}")`,
        data: {
          estree: {
            type: 'Program',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'CallExpression',
                  callee: {
                    type: 'Identifier',
                    name: '_resolveComponent',
                  },
                  arguments: [
                    {
                      type: 'Literal',
                      value: name,
                      raw: `"${name}"`,
                    },
                  ],
                  optional: false,
                },
              },
            ],
            sourceType: 'module',
            comments: [],
          },
        },
      },
    } as MDXJsxAttribute,
  )
}
