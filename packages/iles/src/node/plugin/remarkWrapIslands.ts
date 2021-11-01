import type { Node } from 'unist'
import visit from 'unist-util-visit'
import type { MDXJsxFlowElement, MDXJsxTextElement, MDXJsxAttribute, MDXJsxExpressionAttribute } from 'mdast-util-mdx-jsx'
import type { MDXJSEsm } from 'mdast-util-mdxjs-esm'
import type { ImportDeclaration } from 'estree'
import { unresolvedIslandKey } from './wrap'
import type { ImportsMetadata } from './parse'
import { isString } from './utils'

export default () => (ast: any) => {
  let imports: ImportsMetadata

  visit(ast, (node) => {
    if (isJsxElement(node) && node.attributes.some(hasClientDirective)) {
      if (!imports) imports = extractImports(ast.children.filter((node: Node) => node.type === 'mdxjsEsm'))
      wrapWithIsland(node, imports)
    }
  })
}

function isJsxElement (node: Node): node is MDXJsxFlowElement | MDXJsxTextElement {
  return node.type === 'mdxJsxFlowElement' || node.type === 'mdxJsxTextElement'
}

function hasClientDirective (attr: MDXJsxAttribute | MDXJsxExpressionAttribute) {
  return 'name' in attr && attr.name.startsWith('client:')
}

function isImport (statement: any): statement is ImportDeclaration {
  return statement.type === 'ImportDeclaration'
}

// Internal: Replaces the JSX element with an Island, and sets an attribute to
// enable future resolution.
function wrapWithIsland (node: MDXJsxFlowElement | MDXJsxTextElement, imports: ImportsMetadata) {
  const { name } = node
  if (!name) return

  node.name = 'Island'
  node.attributes.unshift(
    {
      type: 'mdxJsxAttribute',
      name: 'componentName',
      value: name,
    } as MDXJsxAttribute,
    {
      type: 'mdxJsxAttribute',
      name: unresolvedIslandKey,
      value: imports[name] ? identifierExpression(name) : resolveComponentExpression(name),
    } as MDXJsxAttribute,
  )
}

function extractImports (nodes: MDXJSEsm[]) {
  const imports: ImportsMetadata = Object.create(null)
  const declarations = nodes.flatMap(node => node.data?.estree?.body?.filter(isImport) as ImportDeclaration[])

  declarations.forEach(({ specifiers, source: { value: path } }) => {
    if (isString(path)) {
      specifiers.forEach((specifier) => {
        imports[specifier.local.name] = { name: importedName(specifier), path }
      })
    }
  })
  return imports
}

function importedName (specifier: ImportDeclaration['specifiers'][number]) {
  switch (specifier.type) {
    case 'ImportDefaultSpecifier': return 'default'
    case 'ImportNamespaceSpecifier': return '*'
    default: return specifier.imported.name
  }
}

function identifierExpression (name: string) {
  return {
    type: 'mdxJsxAttributeValueExpression',
    value: name,
    data: {
      estree: {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'Identifier',
              name,
            },
          },
        ],
        sourceType: 'module',
      },
    },
  }
}

function resolveComponentExpression (name: string) {
  return {
    type: 'mdxJsxAttributeValueExpression',
    value: `_resolveIlesComponent("${name}")`,
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
      },
    },
  }
}
