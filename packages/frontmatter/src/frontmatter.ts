import { remarkPlugin } from './remark-plugin'

export type {
  FrontmatterPluggable,
  FrontmatterPlugin,
  Frontmatter,
  FrontmatterOptions,
} from './remark-plugin'

/**
 * An iles module that injects remark plugins to parse frontmatter and expose it
 * to the MDX JS expressions as `meta` and `frontmatter`.
 */
export default function IlesFrontmatter (): any {
  let extendFrontmatter: any

  return {
    name: '@islands/frontmatter',
    configResolved ({ markdown }: any) {
      extendFrontmatter = markdown.extendFrontmatter
    },
    markdown: {
      remarkPlugins: [
        [remarkPlugin, { get extendFrontmatter () { return extendFrontmatter } }],
      ],
    },
  }
}

export { remarkPlugin }
