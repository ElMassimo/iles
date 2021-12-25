import type { Raw } from 'hast-util-raw'
import type { ExpressionStatement } from 'estree'
import type { MDXFlowExpression } from 'mdast-util-mdx-expression'
import type { MDXJSEsm } from 'mdast-util-mdxjs-esm'
import type { Plugin } from 'unified'
import type { Parent, Content } from 'hast'
import { toHtml as hastToHtml, Options as ToHtmlOptions } from 'hast-util-to-html'
import type { MarkdownOptions } from './types'

type Child = Content
type Node = Parent | Child

type RawPlugin = Plugin<[MarkdownOptions], Parent, Parent>
type Visitor = (node: Child, index: number, parent: null | Parent) => void

const toHtmlOptions: ToHtmlOptions = { allowDangerousHtml: true }

/**
 * A rehype plugin for converting raw mdx expressions into mdxFlowExpressions
 * that call the `raw` helper from the JSX runtime.
 */
export const rehypeRawExpressions: RawPlugin = options => (ast, vfile) => {
  const shouldCreateTags = new Set(options.overrideTags || [])
  const hoisted: MDXJSEsm[] = []

  const enter: Visitor = (node, index, parent) => {
    if (node.type === 'mdxFlowExpression' && node.data?.raw)
      // @ts-ignore
      node.type = 'raw'

    if (node.type.startsWith('mdx') || shouldCreateTags.has((node as any).tagName))
      setDynamic(node)
  }

  const leave: Visitor = (node, index, parent) => {
    if (isDynamic(node)) {
      if (parent)
        setDynamic(parent)

      if ('children' in node)
        node.children = stringifyNodes(node.children) as any
    }
  }

  const visit: Visitor = (node, index, parent) => {
    if (!node) return

    enter(node, index, parent)

    if ('children' in node) {
      const { children } = node
      const length = children.length
      for (let i = 0; i < length; i++)
        visit(children[i], i, node)
    }

    leave(node, index, parent)
  }

  visit(ast as any, 0, null)
}

const NOT_USED = '_not_used_'

function stringifyNodes (nodes: Child[]) {
  const result: Child[] = []
  let rawNodes: Child[] = []

  const flushRawNodes = () => {
    if (rawNodes.length) {
      result.push(toRaw(rawNodes))
      rawNodes = []
    }
  }

  nodes.forEach(node => {
    if (isDynamic(node)) {
      flushRawNodes()
      result.push(node)
    }
    else {
      rawNodes.push(node)
    }
  })
  flushRawNodes()
  return result
}

function isDynamic (node: Node) {
  return node.data?._createVNode
}

function setDynamic (node: Node) {
  ;(node.data ||= {})._createVNode = true
}

function toRaw (nodes: Child[]) {
  return toRawExpression(toHtml(nodes), nodes.length)
}

function toHtml (nodes: Child[]) {
  try {
    return hastToHtml(nodes, toHtmlOptions)
  }
  catch {
    const flatMap = ({ children, ...node }: any) => [node, children?.map(flatMap)].flat(2).filter(x => x)
    console.error(nodes?.map(flatMap).flat())
    return 'failed'
  }
}

// Internal: Returns an MDX expression to render raw HTML.
function toRawExpression (html: string, count: number): MDXFlowExpression {
  const rawExpression: ExpressionStatement = {
    type: 'ExpressionStatement',
    expression: {
      type: 'CallExpression',
      callee: { type: 'Identifier', name: '_raw' },
      arguments: [
        { type: 'Literal', value: html, raw: JSON.stringify(html) },
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
