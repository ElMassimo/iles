import type rollup from 'xdm/rollup.js'
import type { Plugin, TransformResult } from 'vite'
import { VFile } from 'vfile'

import { createFilter } from '@rollup/pluginutils'
import { createFormatAwareProcessors } from 'xdm/lib/util/create-format-aware-processors.js'

import remarkFrontmatter from 'remark-frontmatter'
import { remarkMdxFrontmatter } from 'remark-mdx-frontmatter'
import { remarkMdxImages } from 'remark-mdx-images'

type Options = Parameters<typeof rollup>[0]

export default function VitePluginXDM (options: Options = {}): Plugin {
  const { include, exclude, ...rest } = options
  rest.remarkPlugins = [
    remarkMdxImages,
    remarkFrontmatter,
    remarkMdxFrontmatter,
  ]
  const processor = createFormatAwareProcessors(rest)
  const filter = createFilter(include, exclude)

  return {
    name: 'vite-plugin-xdm',

    async transform (value, path, ssr) {
      const file = new VFile({ value, path })

      if (filter(file.path) && processor.extnames.includes(file.extname || '')) {
        const compiled = await processor.process(file)
        return { code: String(compiled.value), map: compiled.map } as TransformResult
      }
    }
  }
}
