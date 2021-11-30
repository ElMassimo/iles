import { remarkMdxFrontmatter, FrontmatterOptions } from './remark-mdx-frontmatter'
import { remarkMdxImages, ImageOptions } from './remark-mdx-images'

export type {
  Frontmatter,
  FrontmatterOptions,
} from './remark-mdx-frontmatter'

export type {
  ImageOptions,
} from './remark-mdx-images'

/**
 * An iles module that injects remark plugins to parse frontmatter and expose it
 * to the MDX JS expressions as `meta` and `frontmatter`.
 */
export default function IlesFrontmatter (): any {
  let options: FrontmatterOptions & ImageOptions = {}

  return {
    name: '@islands/frontmatter',
    configResolved ({ markdown }: any) {
      Object.assign(options, markdown)
    },
    markdown: {
      remarkPlugins: [
        [remarkMdxFrontmatter, options],
        [remarkMdxImages, options],
      ],
    },
  }
}
