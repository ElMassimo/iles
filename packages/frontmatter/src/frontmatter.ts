import type { IlesModule, AppConfig } from 'iles'

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
export default function IlesFrontmatter (): IlesModule {
  let extendFrontmatter: AppConfig['markdown']['extendFrontmatter']

  return {
    name: '@islands/frontmatter',
    configResolved ({ markdown }) {
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
