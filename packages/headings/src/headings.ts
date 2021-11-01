import type { Program, VariableDeclarator } from 'estree'
import type { Pluggable, Plugin } from 'unified'
import type { Data, Parent } from 'unist'
import type { IlesModule } from 'iles'

import estreeUtilValueToEstree from 'estree-util-value-to-estree'
import { Node, toString } from 'hast-util-to-string'
import { headingRank } from 'hast-util-heading-rank'
import slugo from 'slugo'

const { valueToEstree } = estreeUtilValueToEstree

export interface Heading {
  level: number
  title: string
  slug: string
}

export interface HeadingOptions {
  slug?: typeof generateSlug
}
export type HeadingPlugin = Plugin<[HeadingOptions?]>
export type HeadingPluggable = [HeadingPlugin, HeadingOptions?]

/**
 * An iles module that injects a rehype plugin to auto-link headings and expose
 * them in `meta`.
 */
export default function IlesHeadings (): IlesModule {
  return {
    name: '@islands/headings',
    markdown: {
      rehypePlugins: [rehypePlugin],
    },
  }
}

/**
 * A rehype plugin to auto-link headings, export title in `frontmatter`, and
 * expose heading data in `meta`.
 *
 * @param options - Optional options to configure the output.
 * @returns A unified transformer.
 */
export const rehypePlugin: HeadingPlugin = ({ slug = generateSlug }: HeadingOptions = {}) => (ast) => {
  const { children } = ast as Parent

  const headings: Heading[] = []
  children.forEach((node: any) => {
    const level = headingRank(node)
    if (level) {
      const title = toString(node)
      headings.push({ level, title, slug: slug(node, title, level) })
    }
  })
  const assignments = [assignment('meta', 'headings', '=', headings)]

  const title = headings.length && headings[0].level === 1 && headings[0].title
  if (title) assignments.push(assignment('frontmatter', 'title', '||=', title))

  children.push({
    type: 'mdxjsEsm',
    data: {
      estree: { type: 'Program', sourceType: 'module', body: assignments },
    },
  })
}

const emojiRegex = /(?:⚡️|[\u2700-\u27BF]|(?:\uD83C[\uDDE6-\uDDFF]){2}|[\uD800-\uDBFF][\uDC00-\uDFFF])[\uFE0E\uFE0F]?(?:[\u0300-\u036F\uFE20-\uFE23\u20D0-\u20F0]|\uD83C[\uDFFB-\uDFFF])?(?:\u200D(?:[^\uD800-\uDFFF]|(?:\uD83C[\uDDE6-\uDDFF]){2}|[\uD800-\uDBFF][\uDC00-\uDFFF])[\uFE0E\uFE0F]?(?:[\u0300-\u036F\uFE20-\uFE23\u20D0-\u20F0]|\uD83C[\uDFFB-\uDFFF])?)*/g
const hyphens = /(^-+)|(-+$)/g

function toSlug (val: string) {
  if (typeof val !== 'string') return ''
  return slugo(val.replace(emojiRegex, '-')).replace(hyphens, '')
}

const anchorTag = (properties: any) => ({
  type: 'element',
  tagName: 'a',
  properties,
  children: [],
})

function generateSlug ({ children, properties }: any, title: string, level: number): string {
  const slug = properties.id ||= toSlug(title)

  properties.className = properties.className ? `${properties.className} heading` : 'heading'

  children.unshift(
    anchorTag({ href: `#${slug}`, className: 'heading-anchor', ariaLabel: `Permalink for ${title}`, tabIndex: -1 }),
  )

  return slug
}

const assignment = (identifier: string, property: string, operator: string, value: any) => ({
  type: 'ExpressionStatement',
  expression: {
    type: 'AssignmentExpression',
    operator,
    left: {
      type: 'MemberExpression',
      object: { type: 'Identifier', name: identifier },
      property: { type: 'Identifier', name: property },
    },
    right: valueToEstree(value),
  },
})
