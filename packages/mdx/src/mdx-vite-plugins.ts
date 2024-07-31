import { extname } from 'node:path'

import type { Plugin, TransformResult } from 'vite'
import type { createFormatAwareProcessors } from '@mdx-js/mdx/internal-create-format-aware-processors'
import hash from 'hash-sum'
import type { MarkdownOptions } from './types'

import { resolvePlugins } from './plugins'

export default function IlesMdx(options: MarkdownOptions = {}): Plugin[] {
  const { remarkPlugins = [], rehypePlugins = [], recmaPlugins = [], ...rest } = options

  let markdownProcessor: ReturnType<typeof createFormatAwareProcessors>
  let isDevelopment: boolean

  function shouldTransform(path: string) {
    return markdownProcessor.extnames.includes(extname(path))
  }

  async function createMdxProcessor(sourcemap: string | boolean) {
    const { createFormatAwareProcessors } = await import('@mdx-js/mdx/internal-create-format-aware-processors')
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

      async configResolved(config) {
        isDevelopment = config.mode === 'development'
        await createMdxProcessor(isDevelopment || config.build.sourcemap)
      },

      async transform(value, path) {
        if (!shouldTransform(path)) { return }

        const compiled = await markdownProcessor.process({ value, path })
        return { code: String(compiled.value), map: compiled.map } as TransformResult
      },
    },
    {
      name: 'iles:mdx:sfc',

      async transform(code, path) {
        if (!shouldTransform(path)) { return }

        return code.replace('export default function MDXContent', () => `
import { defineComponent as $defineComponent } from 'iles/jsx-runtime'

const _sfc_main = /* @__PURE__ */ $defineComponent(MDXContent, {${
  isDevelopment ? `\n  __file: '${path}',` : ''
}})
export default _sfc_main

function MDXContent`)
      },
    },
    {
      name: 'iles:mdx:hmr',
      apply: 'serve',
      transform(code: string, path: string) {
        if (!shouldTransform(path)) { return }

        const hmrId = hash(`${path.split('?', 2)[0]}default`)

        return `${code}
      _sfc_main.__hmrId = "${hmrId}"
      __VUE_HMR_RUNTIME__.createRecord("${hmrId}", _sfc_main)
      import.meta.hot.accept(({ default: component } = {}) => {
        if (component)
          __VUE_HMR_RUNTIME__.reload(component.__hmrId, component)
      })
      `
      },
    },
  ]
}
