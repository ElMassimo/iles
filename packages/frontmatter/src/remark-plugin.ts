import type { Program, VariableDeclarator } from 'estree'
import { name as isValidIdentifierName } from 'estree-util-is-identifier-name'
import { valueToEstree } from 'estree-util-value-to-estree'
import { load as yaml } from 'js-yaml'
import { parse as toml } from 'toml'
import type { Pluggable, Plugin } from 'unified'
import type { Node, Data, Parent } from 'unist'
import visit from 'unist-util-visit'

export type Frontmatter = Record<string, any>

export interface FrontmatterOptions {
  extendFrontmatter?: (frontmatter: Frontmatter, filename: string) => Frontmatter | void;
}

export type FrontmatterPlugin = Plugin<[FrontmatterOptions?]>
export type FrontmatterPluggable = [FrontmatterPlugin, FrontmatterOptions?]

/**
 * A remark plugin to expose frontmatter data as named exports.
 *
 * @param options - Optional options to configure the output.
 * @returns A unified transformer.
 */
const plugin: FrontmatterPlugin = (options?: FrontmatterOptions) => (ast, file) => {
  const parent = ast as Parent
  const frontmatter: Frontmatter = {}
  visit(parent, (node) => {
    const parsed = parseFrontmatter(node as Node<Data> & { value: string })
    const data = parsed ? options?.extendFrontmatter?.(parsed, file.path) || parsed : parsed
    if (data) Object.assign(frontmatter, data)
  })

  parent.children.unshift(defineConsts(
    ...Object.entries(frontmatter).map(([key, value]) => {
      if (!isValidIdentifierName(key))
        throw new Error(`Frontmatter keys should be valid identifiers, got: ${JSON.stringify(key)}`)

      // Example:
      //  const title = 'Example'
      //  const href = 'https://example.com'
      return {
        type: 'VariableDeclarator',
        id: { type: 'Identifier', name: key },
        init: valueToEstree(value),
      } as VariableDeclarator
    }),
    // Example:
    //  const frontmatter = { title, href }
    {
      type: 'VariableDeclarator',
      id: { type: 'Identifier', name: 'frontmatter' },
      init: shorthandObjectExpression(Object.keys(frontmatter)),
    } as VariableDeclarator,
  ))
}

function parseFrontmatter ({ type, value }: { type: string, value: string }) {
  const data = type === 'yaml' ? yaml(value) : type === 'toml' ? toml(value) : undefined
  if (data && typeof data !== 'object')
    throw new Error(`Expected frontmatter data to be an object, got:\n${value}`)
  return data
}

function shorthandObjectExpression (variables: string[]) {
  return {
    type: 'ObjectExpression',
    properties: variables.map(id => ({
      type: 'Property',
      key: { type: 'Identifier', name: id },
      value: { type: 'Identifier', name: id },
      kind: 'init',
      shorthand: true,
      method: false,
      computed: false,
    })),
  }
}

function defineConsts (...declarations: VariableDeclarator[]) {
  return {
    type: 'mdxjsEsm',
    data: {
      estree: {
        type: 'Program',
        sourceType: 'module',
        body: [
          {
            type: 'ExportNamedDeclaration',
            source: null,
            specifiers: [],
            declaration: {
              type: 'VariableDeclaration',
              kind: 'const',
              declarations,
            },
          },
        ],
      } as Program,
    },
  }
}

export default plugin
