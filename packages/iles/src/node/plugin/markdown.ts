import { extname } from 'path'
import type { CompileOptions } from 'xdm/lib/integration/rollup.js'
import type { Plugin, TransformResult } from 'vite'
import type { Pluggable } from 'unified'

import { importModule } from '@islands/modules'
import { isString, isStringPlugin, compact } from './utils'

export type PluginLike = null | undefined | false | Pluggable
export type PluginOption = PluginLike | Promise<PluginLike> | string | [string, any]

export type { Pluggable }

interface CustomOptions {
  /**
   * Remark plugins that should be used to process files.
   */
  remarkPlugins?: PluginOption[]

  /**
   * Rehype plugins that should be used to process files.
   */
  rehypePlugins?: PluginOption[]
}

export type { CompileOptions }
export type PluginOptions = Omit<CompileOptions, 'remarkPlugins' | 'rehypePlugins'> & CustomOptions

export type XdmProcessor = ReturnType<typeof import('xdm/lib/util/create-format-aware-processors.js').createFormatAwareProcessors>

export default function IlesMarkdown (options: PluginOptions = {}) {
  const { remarkPlugins = [], rehypePlugins = [], ...rest } = options

  let xdmProcessor: XdmProcessor

  async function createXDM (sourcemap: string | boolean) {
    const { createFormatAwareProcessors } = await import('xdm/lib/util/create-format-aware-processors.js')
    xdmProcessor = createFormatAwareProcessors({
      remarkPlugins: await resolvePlugins(remarkPlugins),
      rehypePlugins: await resolvePlugins(rehypePlugins),
      SourceMapGenerator: sourcemap ? (await import('source-map')).SourceMapGenerator : undefined,
      ...rest,
    })
  }

  const plugin = {
    name: 'vite-plugin-xdm',

    get api () {
      return xdmProcessor
    },

    async configResolved (config) {
      await createXDM(config.build.sourcemap)
    },

    async transform (value, path) {
      if (xdmProcessor.extnames.includes(extname(path))) {
        const compiled = await plugin.api.process({ value, path })
        return { code: String(compiled.value), map: compiled.map } as TransformResult
      }
    },
  } as Plugin & { api: XdmProcessor }

  return plugin
}

// Resolve plugins that might need an async import in CJS.
async function resolvePlugins (plugins: PluginOption[]) {
  return compact<Pluggable>(await Promise.all(plugins.map(resolvePlugin)))
}

async function resolvePlugin (plugin: PluginOption): Promise<PluginLike> {
  if (isString(plugin)) return await importPlugin(plugin)
  if (!plugin) return plugin
  if (isStringPlugin(plugin)) return await importPlugin(...plugin)
  return plugin
}

async function importPlugin (pkgName: string, ...options: any[]): Promise<Pluggable> {
  return [await importModule(pkgName), ...options]
}
