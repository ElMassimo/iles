import type { Program, VariableDeclarator } from 'estree'
import { valueToEstree } from 'estree-util-value-to-estree'
import { load as yaml } from 'js-yaml'
import { parse as toml } from 'toml'
import type { Pluggable, Plugin } from 'unified'
import type { Node, Data, Parent } from 'unist'

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
const plugin: FrontmatterPlugin = (options?: FrontmatterOptions) => (ast, file) => {
  const parent = ast as Parent
  const nodes = parent.children as (Node<Data> & { value: string })[]
  const rawMatter = mapFind(nodes, parseFrontmatter) || {}
  const { meta, layout: _, ...frontmatter } = options?.extendFrontmatter?.(rawMatter, file.path) || rawMatter
  parent.children.unshift(defineConsts({ meta, frontmatter }))
}

function parseFrontmatter ({ type, value }: { type: string; value: string }) {
  const data = type === 'yaml' ? yaml(value) : type === 'toml' ? toml(value) : undefined
  if (data && typeof data !== 'object')
    throw new Error(`Expected frontmatter data to be an object, got:\n${value}`)
  return data
}

function defineConsts (values: Record<string, any>) {
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
            declarations: Object.entries(values).map(([key, value]) => ({
              type: 'VariableDeclarator',
              id: { type: 'Identifier', name: key },
              init: valueToEstree(value),
            } as VariableDeclarator)),
          },
        ],
      } as Program,
    },
  }
}

export default plugin
