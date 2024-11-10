import type { Node } from 'unist'
import type { ComponentInfo } from 'unplugin-vue-components/types'
import type { Program } from 'estree-jsx'
import type { MdxJsxFlowElement, MdxJsxTextElement, MdxJsxAttribute, MdxJsxExpressionAttribute, MdxJsxAttributeValueExpression } from 'mdast-util-mdx-jsx'
import type { MdxjsEsm } from 'mdast-util-mdxjs-esm'
import type { ImportDeclaration } from 'estree'
import { importModule } from '../modules'
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

function isJsxElement (node: Node): node is MdxJsxFlowElement | MdxJsxTextElement {
  return node.type === 'mdxJsxFlowElement' || node.type === 'mdxJsxTextElement'
}

function isClientDirective (attr: MdxJsxAttribute | MdxJsxExpressionAttribute): attr is MdxJsxAttribute {
  return 'name' in attr && attr.name.startsWith('client:')
}

function isImport (statement: any): statement is ImportDeclaration {
  return statement.type === 'ImportDeclaration'
}

// Internal: Replaces the JSX element with an Island, and sets an attribute to
// enable future resolution.
async function wrapWithIsland (strategy: string, node: MdxJsxFlowElement | MdxJsxTextElement, resolveComponentImport: (strategy: string, name: string) => Promise<ComponentInfo>) {
  const tagName = node.name
  if (!tagName) return

  node.name = 'Island'

  const importMeta = await resolveComponentImport(strategy, tagName)

  node.attributes.unshift(...jsxAttributes({
    component: jsxExpression(strategy === 'client:only'
      ? { type: 'Literal', value: null, raw: 'null' }
      : { type: 'Identifier', name: importMeta.as! }),
    componentName: tagName,
    importName: importMeta.name,
    importFrom: importMeta.from,
  }))
}

function extractImports (nodes: MdxjsEsm[]) {
  const imports: ImportsMetadata = Object.create(null)
  const declarations = nodes.flatMap(node => node.data?.estree?.body?.filter(isImport) as ImportDeclaration[])

  declarations.forEach(({ specifiers, source: { value: from } }) => {
    if (isString(from)) {
      specifiers.forEach((specifier) => {
        const as = specifier.local.name
        imports[as] = { as, name: importedName(specifier), from }
      })
    }
  })
  return imports
}

function importedName (specifier: ImportDeclaration['specifiers'][number]): string {
  switch (specifier.type) {
    case 'ImportDefaultSpecifier': return 'default'
    case 'ImportNamespaceSpecifier': return '*'
    default:
      if ('name' in specifier.imported) return specifier.imported.name
      throw new Error(`Unpexected literal in import declaration: ${specifier.imported}`)
  }
}

function jsxExpression (expression: any): MdxJsxAttributeValueExpression {
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

function jsxAttributes (val: Record<string, MdxJsxAttribute['value']>): MdxJsxAttribute[] {
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
              imported: { type: 'Identifier', name: component.name! },
              local: { type: 'Identifier', name: component.as! },
            },
          ],
          source: { type: 'Literal', value: component.from, raw: `'${component.from}'` },
        })),
      } as Program,
    },
  }
}
