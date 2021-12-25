import remarkFrontmatter from 'remark-frontmatter'

import recmaPlugin from './recma-plugin'
import mdxPlugins from './mdx-vite-plugins'
import { remarkInternalHrefs } from './remark-internal-hrefs'
import { remarkMdxImages } from './remark-mdx-images'
import { rehypeRawExpressions } from './rehype-raw-expressions'

/**
 * An iles module that injects a recma plugin that transforms MDX to allow
 * resolving Vue components statically or at runtime.
 */
export function vueMdx (): any {
  return {
    name: '@islands/mdx',
    markdown: {
      recmaPlugins: [recmaPlugin],
    },
    configResolved (config: any) {
      const { markdown, prettyUrls, srcDir } = config

      markdown.remarkPlugins.unshift(
        [remarkFrontmatter, ['yaml', 'toml']],
        [remarkMdxImages, markdown],
        [remarkInternalHrefs, { prettyUrls }],
      )

      markdown.rehypePlugins.push(
        [rehypeRawExpressions, markdown]
      )

      config.vitePlugins.push(...mdxPlugins(markdown))
    },
  }
}

export { vueMdx as default, recmaPlugin }
export * from './types'
