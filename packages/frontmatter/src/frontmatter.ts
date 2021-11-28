import { remarkMdxFrontmatter } from './remark-mdx-frontmatter'
import { remarkMdxImages } from './remark-mdx-images'

export type {
  FrontmatterPluggable,
  FrontmatterPlugin,
  Frontmatter,
  FrontmatterOptions,
} from './remark-mdx-frontmatter'

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
        [remarkMdxFrontmatter, { get extendFrontmatter () { return extendFrontmatter } }],
        remarkMdxImages,
      ],
    },
  }
}
