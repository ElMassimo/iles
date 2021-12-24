import { extname } from 'path'

import type { Plugin, TransformResult } from 'vite'
import type { createFormatAwareProcessors } from 'xdm/lib/util/create-format-aware-processors'
import type { MarkdownOptions, PluginLike, PluginOption } from './types'

import { resolvePlugins } from './plugins'

import hash from 'hash-sum'

export default function IlesMdx (options: MarkdownOptions = {}): Plugin[] {
  const { remarkPlugins = [], rehypePlugins = [], recmaPlugins = [], ...rest } = options

  let markdownProcessor: ReturnType<typeof createFormatAwareProcessors>
  let isDevelopment: boolean

  function shouldTransform (path: string) {
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
        if (!shouldTransform(path)) return

        const compiled = await markdownProcessor.process({ value, path })
        return { code: String(compiled.value), map: compiled.map } as TransformResult
      },
    },
    {
      name: 'iles:mdx:sfc',

      async transform (code, path) {
        if (!shouldTransform(path)) return

        return code.replace('export default MDXContent', `
import { defineComponent as $defineComponent } from 'iles/jsx-runtime'

const _sfc_main = /* @__PURE__ */ $defineComponent(MDXContent, {${
  isDevelopment ? `\n  __file: '${path}',` : ''
}})

export default _sfc_main`)
      },
    },
    {
      name: 'iles:mdx:hmr',
      apply: 'serve',
      transform (code: string, path: string) {
        if (!shouldTransform(path)) return

        const hmrId = hash(`${path.split('?', 2)[0]}default`)
        const sameFrontmatter = this.getModuleInfo(path)?.meta.sameFrontmatter

        return `${code}
      _sfc_main.__hmrId = "${hmrId}"
      __VUE_HMR_RUNTIME__.createRecord("${hmrId}", _sfc_main)
      export const _sameFrontmatter = ${sameFrontmatter}
      import.meta.hot.accept(mod => {
        if (mod) {
          const updated = mod.default
          if (mod._sameFrontmatter)
            __VUE_HMR_RUNTIME__.rerender(updated.__hmrId, updated.render)
          else
            __VUE_HMR_RUNTIME__.reload(updated.__hmrId, updated)
        }
      })
      `
      },
    },
  ]
}
