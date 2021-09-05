import { Program } from 'estree'
import { name as isValidIdentifierName } from 'estree-util-is-identifier-name'
import { Value, valueToEstree } from 'estree-util-value-to-estree'
import { load } from 'js-yaml'
import { parse } from 'toml'
import type { Attacher } from 'unified'
import type { Node, Parent } from 'unist'
import visit from 'unist-util-visit'

export interface RemarkMdxFrontmatterOptions {
  /**
   * If specified, the YAML data is exported using this name. Otherwise, each
   * object key will be used as an export name.
   */
  name?: string
}

/**
 * A remark plugin to expose frontmatter data as named exports.
 *
 * @param options - Optional options to configure the output.
 * @returns A unified transformer.
 */
export const remarkMdxFrontmatter: Attacher<[RemarkMdxFrontmatterOptions?]> = ({ name } = {}) => (
  ast,
) => {
  const parent = ast as Parent
  const imports: Node[] = []
  const identifiers: string[] = []

  if (name && !isValidIdentifierName(name)) {
    throw new Error(
      `If name is specified, this should be a valid identifier name, got: ${JSON.stringify(name)}`,
    )
  }

  visit(parent, (node) => {
    let data: Value
    const value = (node as any).value
    if (node.type === 'yaml')
      data = load(value as string) as Value
    else if (node.type === 'toml')
      data = parse(value as string)

    if (data == null)
      return

    if (!name && typeof data !== 'object')
      throw new Error(`Expected frontmatter data to be an object, got:\n${value}`)

    imports.push({
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
                declarations: Object.entries(name ? { [name]: data } : data).map(
                  ([identifier, value]) => {
                    if (!isValidIdentifierName(identifier)) {
                      throw new Error(
                        `Frontmatter keys should be valid identifiers, got: ${JSON.stringify(
                          identifier,
                        )}`,
                      )
                    }
                    identifiers.push(identifier)
                    return {
                      type: 'VariableDeclarator',
                      id: { type: 'Identifier', name: identifier },
                      init: valueToEstree(value),
                    }
                  },
                ),
              },
            },
          ],
        } as Program,
      },
    })
  })
  parent.children.unshift(...imports)
  parent.children.push({
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
              declarations: [
                {
                  type: 'VariableDeclarator',
                  id: {
                    type: 'Identifier',
                    name: 'frontmatter',
                  },
                  init: {
                    type: 'ObjectExpression',
                    properties: identifiers.map(id => ({
                      type: 'Property',
                      shorthand: true,
                      key: { type: 'Identifier', name: id },
                      kind: 'init',
                      value: { type: 'Identifier', name: id },
                    })),
                  },
                },
              ],
            },
          },
        ],
      } as Program,
    },
  })
}
