import remarkFrontmatter from 'remark-frontmatter'

import type { VFile } from '@mdx-js/mdx/lib/plugin/recma-stringify'
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
      const { markdown, prettyUrls, namedPlugins } = config

      markdown.remarkPlugins.unshift(
        [remarkFrontmatter, ['yaml', 'toml']],
        [remarkMdxImages, markdown],
        [remarkInternalHrefs, { prettyUrls }],
      )

      markdown.rehypePlugins.push(
        [rehypeRawExpressions, markdown],
      )

      markdown.recmaPlugins.push(
        // NOTE: Expose VFile data added by remark and rehype plugins.
        () => (_ast: any, vfile: VFile) => {
          const page = namedPlugins.pages.api.pageForFilename(vfile.path)
          if (page) Object.assign(page.frontmatter.meta, vfile.data)
        },
      )

      config.vitePlugins.push(...mdxPlugins(markdown))
    },
  }
}

export { vueMdx as default, recmaPlugin }
export * from './types'
