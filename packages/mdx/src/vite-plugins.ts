import { extname } from 'path'

import type { Plugin, TransformResult } from 'vite'
import type { createFormatAwareProcessors } from 'xdm/lib/util/create-format-aware-processors'
import type { MarkdownOptions, PluginLike, PluginOption } from './types'

import { resolvePlugins } from './plugins'
import { hmrRuntime } from './hmr'

export default function IlesMdx (options: MarkdownOptions = {}): Plugin[] {
  const { remarkPlugins = [], rehypePlugins = [], recmaPlugins = [], ...rest } = options

  let markdownProcessor: ReturnType<typeof createFormatAwareProcessors>
  let isDevelopment: boolean

  function shouldTranform (path: string) {
    return markdownProcessor.extnames.includes(extname(path))
  }

  async function createXDM (sourcemap: string | boolean) {
    const { createFormatAwareProcessors } = await import('xdm/lib/util/create-format-aware-processors.js')
    markdownProcessor = createFormatAwareProcessors({
      remarkPlugins: await resolvePlugins(remarkPlugins),
      rehypePlugins: await resolvePlugins(rehypePlugins),
      recmaPlugins: await resolvePlugins(recmaPlugins),
      SourceMapGenerator: sourcemap ? (await import('source-map')).SourceMapGenerator : undefined,
      ...rest,
    })
  }

  return [
    {
      name: 'iles:mdx:compile',

      async configResolved (config) {
        isDevelopment = config.mode === 'development'
        await createXDM(isDevelopment || config.build.sourcemap)
      },

      async transform (value, path) {
        if (!shouldTranform(path)) return

        const compiled = await markdownProcessor.process({ value, path })
        return { code: String(compiled.value), map: compiled.map } as TransformResult
      },
    },
    {
      name: 'iles:mdx:sfc',

      async transform (code, path) {
        if (!shouldTranform(path)) return

        return code.replace('export default MDXContent', `
${code.includes(' defineComponent') ? '' : 'import { defineComponent } from \'vue\''}

const _sfc_main = defineComponent({
  props: {
    components: { type: Object },
  },
  render (props) {
    if (!props) props = this ? { ...this.$props, ...this.$attrs } : {}
    return MDXContent(props)
  },${isDevelopment ? `\n  __file: '${path}',` : ''}
})
export default _sfc_main
${isDevelopment ? hmrRuntime(path) : ''}`)
      },
    },
  ]
}
