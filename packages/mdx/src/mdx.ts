import recmaPlugin from './recma-plugin'
import vitePlugins from './vite-plugins'

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
      config.vitePlugins.push(...vitePlugins(config.markdown))
    },
  }
}

export { vueMdx as default, recmaPlugin }
export * from './types'
