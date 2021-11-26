import type { Node } from 'unist'
import type { ComponentInfo } from 'unplugin-vue-components/types'
import type { MDXJsxFlowElement, MDXJsxTextElement, MDXJsxAttribute, MDXJsxExpressionAttribute, MDXJsxAttributeValueExpression, Program } from 'mdast-util-mdx-jsx'
import type { MDXJSEsm } from 'mdast-util-mdxjs-esm'
import type { ImportDeclaration } from 'estree'
import { importModule } from 'lib/modules'
import { AppConfig } from '../shared'
import { resolveComponent, resolveImportPath } from './wrap'
import type { ImportsMetadata } from './parse'
import { debug, isString } from './utils'

export default ({ config }: { config: AppConfig }) => async (ast: any, file: any) => {
  let components = config.namedPlugins.components.api
  let imports: ImportsMetadata
  let componentPromises: (Promise<ComponentInfo>)[] = []
  let componentCounter = 0

  const unistUtilVisit = await importModule('unist-util-visit')
  const visit: typeof import('unist-util-visit').visit = unistUtilVisit.visit || unistUtilVisit
  const SKIP = unistUtilVisit.SKIP

  visit(ast, (node: Node) => {
    const strategy = isJsxElement(node) && node.attributes.find(isClientDirective)?.name
    if (strategy) {
      wrapWithIsland(strategy, node, resolveComponentImport)
      return SKIP
    }
  })

  const componentsToImport = await Promise.all(componentPromises)
  if (componentsToImport.length > 0)
    ast.children.unshift(defineImports(componentsToImport))

  async function resolveComponentImport (strategy: string, tagName: string) {
    debug.detect(`<${tagName} ${strategy}>`)
    if (!imports) imports = extractImports(ast.children.filter((node: Node) => node.type === 'mdxjsEsm'))
    if (imports[tagName]) return await resolveImportPath(config, imports[tagName], file.path)
    const info = resolveComponent(components, tagName, file.path, componentCounter++)
    if (strategy !== 'client:only') componentPromises.push(info)
    return await info
  }
}

function isJsxElement (node: Node): node is MDXJsxFlowElement | MDXJsxTextElement {
  return node.type === 'mdxJsxFlowElement' || node.type === 'mdxJsxTextElement'
}

function isClientDirective (attr: MDXJsxAttribute | MDXJsxExpressionAttribute): attr is MDXJsxAttribute {
  return 'name' in attr && attr.name.startsWith('client:')
}

function isImport (statement: any): statement is ImportDeclaration {
  return statement.type === 'ImportDeclaration'
}

// Internal: Replaces the JSX element with an Island, and sets an attribute to
// enable future resolution.
async function wrapWithIsland (strategy: string, node: MDXJsxFlowElement | MDXJsxTextElement, resolveComponentImport: (strategy: string, name: string) => Promise<ComponentInfo>) {
  const tagName = node.name
  if (!tagName) return

  node.name = 'Island'

  const importMeta = await resolveComponentImport(strategy, tagName)

  node.attributes.unshift(...jsxAttributes({
    component: jsxExpression(strategy === 'client:only'
      ? { type: 'Literal', value: null, raw: 'null' }
      : { type: 'Identifier', name: importMeta.name! }),
    componentName: tagName,
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

function jsxExpression (expression: any): MDXJsxAttributeValueExpression {
  return {
    type: 'mdxJsxAttributeValueExpression',
    value: expression.name || expression.raw,
    data: {
      estree: {
        type: 'Program',
        sourceType: 'module',
        body: [{ type: 'ExpressionStatement', expression }],
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
              local: { type: 'Identifier', name: component.name! },
            },
          ],
          source: { type: 'Literal', value: component.path, raw: `'${component.path}'` },
        })),
      } as Program,
    },
  }
}
