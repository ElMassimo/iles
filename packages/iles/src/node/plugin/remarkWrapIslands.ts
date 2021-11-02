import type { Node } from 'unist'
import type { ComponentInfo } from 'unplugin-vue-components/types'
import type { MDXJsxFlowElement, MDXJsxTextElement, MDXJsxAttribute, MDXJsxExpressionAttribute, MDXJsxAttributeValueExpression, Program } from 'mdast-util-mdx-jsx'
import type { MDXJSEsm } from 'mdast-util-mdxjs-esm'
import type { ImportDeclaration } from 'estree'
import { AppConfig } from '../shared'
import { importESModule } from '../modules'
import { resolveComponent } from './wrap'
import type { ImportsMetadata } from './parse'
import { isString } from './utils'

export default (options: { config: AppConfig }) => async (ast: any, file: any) => {
  let components = options.config.namedPlugins.components.api
  let imports: ImportsMetadata
  let componentPromises: (Promise<ComponentInfo>)[] = []

  const unistUtilVisit = await importESModule('unist-util-visit')
  const visit: typeof import('unist-util-visit').visit = unistUtilVisit.visit || unistUtilVisit
  const SKIP = unistUtilVisit.SKIP

  visit(ast, (node: Node) => {
    if (isJsxElement(node) && node.attributes.some(hasClientDirective)) {
      wrapWithIsland(node, resolveComponentImport)
      return SKIP
    }
  })

  const componentsToImport = await Promise.all(componentPromises)
  if (componentsToImport.length > 0)
    ast.children.unshift(defineImports(componentsToImport))

  async function resolveComponentImport (name: string) {
    if (!imports) imports = extractImports(ast.children.filter((node: Node) => node.type === 'mdxjsEsm'))
    if (imports[name]) return imports[name]
    const info = resolveComponent(components, name, file.path, componentPromises.length)
    componentPromises.push(info)
    return await info
  }
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
async function wrapWithIsland (node: MDXJsxFlowElement | MDXJsxTextElement, resolveComponentImport: (name: string) => Promise<ComponentInfo>) {
  const { name } = node
  if (!name) return

  node.name = 'Island'

  const importMeta = await resolveComponentImport(name)

  node.attributes.unshift(...jsxAttributes({
    component: identifierExpression(importMeta.name!),
    componentName: name,
    importName: importMeta.importName,
    importPath: importMeta.path,
  }))
}

function extractImports (nodes: MDXJSEsm[]) {
  const imports: ImportsMetadata = Object.create(null)
  const declarations = nodes.flatMap(node => node.data?.estree?.body?.filter(isImport) as ImportDeclaration[])

  declarations.forEach(({ specifiers, source: { value: path } }) => {
    if (isString(path)) {
      specifiers.forEach((specifier) => {
        const name = specifier.local.name
        imports[name] = { name, importName: importedName(specifier), path }
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

function identifierExpression (name: string): MDXJsxAttributeValueExpression {
  return {
    type: 'mdxJsxAttributeValueExpression',
    value: name,
    data: {
      estree: {
        type: 'Program',
        sourceType: 'module',
        body: [
          {
            type: 'ExpressionStatement',
            expression: { type: 'Identifier', name },
          },
        ],
      },
    },
  }
}

function jsxAttributes (val: Record<string, MDXJsxAttribute['value']>): MDXJsxAttribute[] {
  return Object.entries(val).map(([name, value]) => (
    { type: 'mdxJsxAttribute', name, value }
  ))
}

function defineImports (components: ComponentInfo[]) {
  return {
    type: 'mdxjsEsm',
    data: {
      estree: {
        type: 'Program',
        sourceType: 'module',
        body: components.map(component => ({
          type: 'ImportDeclaration',
          specifiers: [
            {
              type: 'ImportSpecifier',
              imported: { type: 'Identifier', name: component.importName! },
              local: { type: 'Identifier', name: component.name! }
            },
          ],
          source: { type: 'Literal', value: component.path, raw: `'${component.path}'` },
        })),
      } as Program,
    },
  }
}
