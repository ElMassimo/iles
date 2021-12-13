import { walk } from 'estree-walker'
import type { Node, Statement, ImportSpecifier, FunctionDeclaration, Program } from 'estree-jsx'
import type { Plugin } from 'unified'

import { ArrayExpression, CallExpression, ConditionalExpression, Expression, Identifier, ObjectExpression, Property, VariableDeclaration } from 'estree'

/**
 * A plugin that splits MDXContent into before/after excerpt separator, and
 * toggles rendering with an `excerpt` prop.
 */
export const recmaPlugin: Plugin<[], Program> = function recmaExcerpt () {
  return (tree) => {
    let done = false

    walk(tree, {
      // @ts-ignore
      enter (node: Node) {
        if (node.type === 'FunctionDeclaration' && node.id?.name === 'MDXContent') {
          const createMdxContent = node.body.body.find(s =>
            s.type === 'FunctionDeclaration' && s.id?.name === '_createMdxContent',
          ) as FunctionDeclaration | undefined

          if (createMdxContent)
            splitOnExcerptSeparator(createMdxContent.body.body)

          done = true
        }

        if (done) return this.skip()
      },
    })

    return tree
  }
}

function splitOnExcerptSeparator (statements: Statement[]) {
  for (let index = statements.length - 1; index >= 0; index--) {
    const s = statements[index]

    if (s.type === 'ReturnStatement') {
      const [id, childrenObj] = ((s.argument as any).arguments || []) as [Identifier, ObjectExpression]
      if (id?.name === '_Fragment') {
        const childrenProp = childrenObj.properties[0] as Property
        const [excerptElements, restElements] = splitExcerptElements(childrenProp.value as ArrayExpression)
        statements.splice(index, 0, declareExcerpt(excerptElements))
        childrenProp.value = conditionalExcerpt(restElements)
      }
      break
    }
  }
}

function splitExcerptElements (childrenExpr: ArrayExpression) {
  const excerptIndex = childrenExpr.elements.findIndex(node =>
    node?.type === 'CallExpression' && (node.arguments[0] as any)?.property?.name === 'excerpt')
  return [
    childrenExpr.elements.slice(0, excerptIndex),
    childrenExpr.elements.slice(excerptIndex + 1),
  ]
}

const excerptIdentifier: Identifier = { type: 'Identifier', name: '_excerpt' }

function declareExcerpt (elements: ArrayExpression['elements']): VariableDeclaration {
  return {
    kind: 'const',
    type: 'VariableDeclaration',
    declarations: [
      {
        type: 'VariableDeclarator',
        id: excerptIdentifier,
        init: { type: 'ArrayExpression', elements },
      },
    ],
  }
}

function conditionalExcerpt (elements: ArrayExpression['elements']): ConditionalExpression {
  return {
    type: 'ConditionalExpression',
    test: {
      type: 'MemberExpression',
      object: { type: 'Identifier', name: 'props' },
      property: { type: 'Identifier', name: 'excerpt' },
      computed: false,
      optional: false,
    },
    consequent: excerptIdentifier,
    alternate: {
      type: 'ArrayExpression',
      elements: [
        { type: 'SpreadElement', argument: excerptIdentifier },
        ...elements,
      ],
    },
  }
}
