import type { ExpressionStatement } from 'estree'
import type { MDXFlowExpression } from 'mdast-util-mdx-expression'
import type { MDXJSEsm } from 'mdast-util-mdxjs-esm'
import type { Root, Raw } from 'hast'
import type { Plugin } from 'unified'
import { visit, SKIP } from 'unist-util-visit'
import type { MarkdownOptions } from './types'

import { isAbsolute, isJsxElement, isString } from './utils'

type RawPlugin = Plugin<[MarkdownOptions?], Root, Root>

import fs from 'fs'

/**
 * A rehype plugin for converting raw mdx expressions into mdxFlowExpressions
 * that call the `raw` helper from the JSX runtime.
 */
export const rehypeRawExpressions: RawPlugin = options => (ast, vfile) => {
  const hoisted: MDXJSEsm[] = []

  fs.writeFileSync(vfile.path.replace('.mdx', '.json'), JSON.stringify(ast, null, 2), 'utf-8')

  visit(ast, (node, index, parent) => {
    if (!node.type.startsWith('mdx'))
      if (node.data) node.data.mdxRaw = true

    if (node.type === 'mdxFlowExpression' && node.data?.raw) {
      node.type = 'raw'
      parent.children[index] = toRawExpression(node)
    }
  }, true)
}

interface MDXRawExpression {
  type: 'mdxRawExpression'
  value: string
  data: { count: number }
}

const NOT_USED = '_not_used_'

// Internal: Returns an MDX expression to render raw HTML.
function toRawExpression ({ value, data }: Raw): MDXFlowExpression {
  const count = data?.count || 1
  const rawExpression: ExpressionStatement = {
    type: 'ExpressionStatement',
    expression: {
      type: 'CallExpression',
      callee: { type: 'Identifier', name: '_raw' },
      arguments: [
        { type: 'Literal', value, raw: JSON.stringify(value) },
        { type: 'Literal', value: count, raw: String(count) },
      ],
      optional: false,
    },
  }
  return {
    type: 'mdxFlowExpression',
    value: NOT_USED,
    data: { estree: { type: 'Program', sourceType: 'module', body: [rawExpression] } },
  }
}
