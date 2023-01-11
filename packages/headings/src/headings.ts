import type { Program, VariableDeclarator } from 'estree'
import type { Pluggable, Plugin } from 'unified'
import type { Data, Parent } from 'unist'
import type { IlesModule } from 'iles'

import { Node, toString } from 'hast-util-to-string'
import { headingRank } from 'hast-util-heading-rank'
import slugo from 'slugo'

export interface Heading {
  level: number
  title: string
  slug: string
}

export interface HeadingOptions {
  slug?: ({ children, properties }: any, title: string, level: number, data: any) => string
  initData?: (ast: any) => any
}

export type HeadingPlugin = Plugin<[HeadingOptions?]>

declare module 'iles' {
  interface PageMeta {
    /**
     * Headings for MDX documents.
     */
    headings?: Heading[]
  }
}

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
 * @param options - Options to configure heading generation.
 */
export const rehypePlugin: HeadingPlugin = ({ slug = generateSlug, initData = initCounter } = {}) => (ast, vfile) => {
  const { children } = ast as Parent

  const data = initData(ast)

  const headings: Heading[] = []
  children.forEach((node: any) => {
    const level = headingRank(node)
    if (level) {
      const title = toString(node)
      headings.push({ level, title, slug: slug(node, title, level, data) })
    }
  })

  const title = headings.length && headings[0].level === 1 && headings[0].title

  // The @islands/mdx plugin will expose all data in `meta`.
  if (title) vfile.data.title = title
  vfile.data.headings = headings
}

function initCounter () {
  const counter = new Map<string, number>()
  counter.set('app', 1)
  return counter
}

const emojiRegex = /(?:⚡️|[\u2700-\u27BF]|(?:\uD83C[\uDDE6-\uDDFF]){2}|[\uD800-\uDBFF][\uDC00-\uDFFF])[\uFE0E\uFE0F]?(?:[\u0300-\u036F\uFE20-\uFE23\u20D0-\u20F0]|\uD83C[\uDFFB-\uDFFF])?(?:\u200D(?:[^\uD800-\uDFFF]|(?:\uD83C[\uDDE6-\uDDFF]){2}|[\uD800-\uDBFF][\uDC00-\uDFFF])[\uFE0E\uFE0F]?(?:[\u0300-\u036F\uFE20-\uFE23\u20D0-\u20F0]|\uD83C[\uDFFB-\uDFFF])?)*/g
const hyphens = /(^-+)|(-+$)/g

function toSlug (val: string, counter: Map<string, number>) {
  if (typeof val !== 'string') return ''

  const originalSlug = slugo(val.replace(emojiRegex, '-')).replace(hyphens, '')
  let slug = originalSlug

  if (counter.has(originalSlug)) {
    // counter.get(originalSlug) cannot be undefined, used `|| 1` instead of `!` for TypeScript to be safer
    let count = (counter.get(originalSlug) || 1) + 1
    while (counter.has(`${originalSlug}-${count}`)) count += 1
    counter.set(originalSlug, count)
    slug = `${originalSlug}-${count}`
  }

  // no matter counter.has(originalSlug) or not, (slug, 1) should be added in the counter
  counter.set(slug, 1)

  return slug
}

const anchorTag = (properties: any) => ({
  type: 'element',
  tagName: 'a',
  properties,
  children: [],
})

function generateSlug ({ children, properties }: any, title: string, level: number, counter: Map<string, number>): string {
  const slug = properties.id ||= toSlug(title, counter)

  properties.className = properties.className ? `${properties.className} heading` : 'heading'

  children.unshift(
    anchorTag({ href: `#${slug}`, className: 'heading-anchor', ariaLabel: `Permalink for ${title}`, tabIndex: -1 }),
  )

  return slug
}
