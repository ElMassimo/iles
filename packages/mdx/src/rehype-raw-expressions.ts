import type { Identifier, CallExpression, VariableDeclarator, Expression } from 'estree'
import type { MdxFlowExpression } from 'mdast-util-mdx-expression'
import type { MdxjsEsm } from 'mdast-util-mdxjs-esm'
import type { Plugin } from 'unified'
import type { Parent, Content, Element } from 'hast'
import { toHtml as hastToHtml, type Options as ToHtmlOptions } from 'hast-util-to-html'
import type { MarkdownOptions } from './types'

type Child = Content
type Node = Parent | Child

type RawPlugin = Plugin<[MarkdownOptions], Parent, Parent>
type Visitor = (node: Child, parent?: Parent) => void
type Hoisted = VariableDeclarator[]

const toHtmlOptions: ToHtmlOptions = { allowDangerousHtml: true }

/**
 * A rehype plugin for converting raw mdx expressions into mdxFlowExpressions
 * that call the `raw` helper from the JSX runtime.
 */
export const rehypeRawExpressions: RawPlugin = options => (ast, vfile) => {
  const dynamicElements = new Set(options.overrideElements || [])
  const hoisted: Hoisted = []

  dynamicElements.add('excerpt')

  const enter: Visitor = (node) => {
    if (node.type === 'mdxFlowExpression' && (node.data as any)?.raw)
      // @ts-ignore
      node.type = 'raw'

    if (node.type.startsWith('mdx') || dynamicElements.has((node as Element).tagName))
      setDynamic(node)
  }

  const leave: Visitor = (node, parent) => {
    if (isDynamic(node)) {
      if (parent)
        setDynamic(parent)

      if ('children' in node)
        node.children = stringifyNodes(hoisted, node.children) as any
    }
  }

  const visit: Visitor = (node, parent) => {
    if (!node) return

    enter(node, parent)

    if ('children' in node)
      node.children.forEach(child => visit(child, node))

    leave(node, parent)
  }

  setDynamic(ast)
  visit(ast as any)

  if (hoisted.length) {
    ast.children.unshift({
      type: 'mdxjsEsm',
      value: NOT_USED,
      data: {
        estree: {
          type: 'Program',
          sourceType: 'module',
          body: [
            { kind: 'const', type: 'VariableDeclaration', declarations: hoisted },
          ],
        },
      },
    } as MdxjsEsm as any)
  }
}

const NOT_USED = '_not_used_'

function stringifyNodes (hoisted: Hoisted, nodes: Child[]) {
  const result: Child[] = []
  let rawNodes: Child[] = []

  const flushRawNodes = () => {
    if (rawNodes.length) {
      result.push(hoistRawNodes(hoisted, rawNodes))
      rawNodes = []
    }
  }

  nodes.forEach((node) => {
    if (isDynamic(node)) {
      // @ts-ignore
      if (node.type !== 'mdxjsEsm') flushRawNodes()
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
  return (node.data as any)?._createVNode
}

function setDynamic (node: Node) {
  ((node.data ||= {}) as any)._createVNode = true
}

function hoistRawNodes (hoisted: Hoisted, nodes: Child[]): MdxFlowExpression {
  let expression: Expression
  if (nodes.length === 1 && nodes[0].type === 'text') {
    const { value } = nodes[0]
    expression = { type: 'Literal', value, raw: JSON.stringify(value) }
  }
  else {
    const id: Identifier = { type: 'Identifier', name: `_mdh_${hoisted.length}` }
    hoisted.push(variableForRawNodes(id, toHtml(nodes), nodes.length))
    expression = id
  }

  return {
    type: 'mdxFlowExpression',
    value: NOT_USED,
    data: {
      estree: {
        type: 'Program',
        sourceType: 'module',
        body: [
          { type: 'ExpressionStatement', expression },
        ],
      },
    },
  }
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

// Internal: Returns a variable definition that calls `raw` with the specified html.
function variableForRawNodes (id: Identifier, html: string, count: number): VariableDeclarator {
  const rawExpression: CallExpression = {
    type: 'CallExpression',
    callee: { type: 'Identifier', name: '_raw' },
    arguments: [
      { type: 'Literal', value: html, raw: JSON.stringify(html) },
      { type: 'Literal', value: count, raw: String(count) },
    ],
    optional: false,
  }
  return { type: 'VariableDeclarator', id, init: rawExpression }
}
