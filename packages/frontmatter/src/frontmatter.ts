import { remarkMdxFrontmatter, FrontmatterOptions } from './remark-mdx-frontmatter'
import { remarkMdxImages, ImageOptions } from './remark-mdx-images'
import { remarkInternalHrefs, HrefOptions } from './remark-internal-hrefs'

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
  let options: FrontmatterOptions & ImageOptions & HrefOptions = {}

  return {
    name: '@islands/frontmatter',
    configResolved ({ markdown, prettyUrls }: any) {
      Object.assign(options, markdown, { prettyUrls })
    },
    markdown: {
      remarkPlugins: [
        [remarkMdxFrontmatter, options],
        [remarkMdxImages, options],
        [remarkInternalHrefs, options],
      ],
    },
  }
}
