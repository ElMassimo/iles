import type { Program, VariableDeclarator } from 'estree'
import type { Pluggable, Plugin } from 'unified'
import type { Node, Data, Parent } from 'unist'

import estreeUtilValueToEstree from 'estree-util-value-to-estree'
import { load as yaml } from 'js-yaml'
import { name as isValidIdentifierName } from 'estree-util-is-identifier-name'
import { frontmatter } from 'micromark-extension-frontmatter'
import { frontmatterFromMarkdown, frontmatterToMarkdown } from 'mdast-util-frontmatter'

const { valueToEstree } = estreeUtilValueToEstree

export type Frontmatter = Record<string, any>

export interface FrontmatterOptions {
  extendFrontmatter?: (frontmatter: Frontmatter, filename: string) => Frontmatter | void
}

export type FrontmatterPlugin = Plugin<[FrontmatterOptions?]>
export type FrontmatterPluggable = [FrontmatterPlugin, FrontmatterOptions?]

function mapFind <T, O> (arr: T[], fn: (i: T) => O): O | undefined {
  let result
  let found = arr.find(item => result = fn(item))
  return result
}

/**
 * A remark plugin to expose frontmatter data as named exports.
 *
 * @param options - Optional options to configure the output.
 * @returns A unified transformer.
 */
export const remarkMdxFrontmatter: FrontmatterPlugin = function (options?: FrontmatterOptions) {
  const data = this.data()

  const addExtension = (field: string, value: unknown) => {
    const list = (data[field] ||= []) as unknown[]
    list.push(value)
  }

  const preset = 'yaml'
  addExtension('micromarkExtensions', frontmatter(preset))
  addExtension('fromMarkdownExtensions', frontmatterFromMarkdown(preset))
  addExtension('toMarkdownExtensions', frontmatterToMarkdown(preset))

  return (ast, file) => {
    const parent = ast as Parent
    const nodes = parent.children as (Node<Data> & { value: string })[]
    const rawMatter = mapFind(nodes, parseFrontmatter) || {}
    const { meta, layout: _, ...frontmatter } = options?.extendFrontmatter?.(rawMatter, file.path) || rawMatter
    parent.children.unshift(defineConsts({ ...frontmatter, meta, frontmatter }))
  }
}

function parseFrontmatter ({ type, value }: { type: string; value: string }) {
  const data = type === 'yaml' ? yaml(value) as any : undefined
  if (data && typeof data !== 'object')
    throw new Error(`Expected frontmatter data to be an object, got:\n${value}`)
  return data
}

function defineConsts (variables: Record<string, any>) {
  return {
    type: 'mdxjsEsm',
    data: {
      estree: {
        type: 'Program',
        sourceType: 'module',
        body: [
          {
            type: 'VariableDeclaration',
            kind: 'const',
            declarations: Object.entries(variables).map(([key, value]) => {
              if (!isValidIdentifierName(key))
                throw new Error(`Frontmatter keys should be valid identifiers, got: ${JSON.stringify(key)}`)

              return {
                type: 'VariableDeclarator',
                id: { type: 'Identifier', name: key },
                init: key === 'frontmatter'
                  ? shorthandObjectExpression(value)
                  : valueToEstree(value),
              } as VariableDeclarator
            }),
          },
        ],
      } as Program,
    },
  }
}

// Example:
//  const frontmatter = { title, source }
function shorthandObjectExpression (value: Record<string, any>) {
  return {
    type: 'ObjectExpression',
    properties: Object.keys(value).map(id => ({
      type: 'Property',
      key: { type: 'Identifier', name: id },
      value: { type: 'Identifier', name: id },
      kind: 'init',
      shorthand: true,
    })),
  }
}
