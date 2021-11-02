import { extname } from 'path'
import type { Pluggable } from 'unified'
import type { TransformResult } from 'vite'
import { importModule } from '@islands/modules'
import type { MarkdownPlugin, MarkdownOptions, MarkdownProcessor } from '../shared'
import { isString, isStringPlugin, compact } from './utils'

type PluginLike = null | undefined | false | Pluggable
type PluginOption = PluginLike | Promise<PluginLike> | string | [string, any]

export const markdown: MarkdownPlugin = function IlesMarkdown (options: MarkdownOptions = {}) {
  const { remarkPlugins = [], rehypePlugins = [], ...rest } = options

  let markdownProcessor: MarkdownProcessor

  async function createXDM (sourcemap: string | boolean) {
    const { createFormatAwareProcessors } = await importModule('xdm')
    markdownProcessor = createFormatAwareProcessors({
      remarkPlugins: await resolvePlugins(remarkPlugins),
      rehypePlugins: await resolvePlugins(rehypePlugins),
      SourceMapGenerator: sourcemap ? (await import('source-map')).SourceMapGenerator : undefined,
      ...rest,
    })
  }

  return {
    name: 'vite-plugin-xdm',

    get api () {
      return markdownProcessor
    },

    async configResolved (config) {
      await createXDM(config.build.sourcemap)
    },

    async transform (value, path) {
      if (markdownProcessor.extnames.includes(extname(path))) {
        const compiled = await markdownProcessor.process({ value, path })
        return { code: String(compiled.value), map: compiled.map } as TransformResult
      }
    },
  }
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
