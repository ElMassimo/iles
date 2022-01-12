/* eslint-disable no-restricted-syntax */
import { promises as fs } from 'fs'
import { relative } from 'pathe'
import { build as viteBuild, mergeConfig as mergeViteConfig } from 'vite'
import type { UserConfig as ViteUserConfig, Plugin } from 'vite'
import type { PreRenderedChunk } from 'rollup'
import IslandsPlugins from '../plugin/plugin'
import type { AppConfig, IslandsByPath } from '../shared'
import { TURBO_SCRIPT_PATH } from '../alias'
import { flattenPath } from './utils'
import { extendManualChunks } from './chunks'

export const VIRTUAL_PREFIX = 'virtual_ile_'
export const VIRTUAL_TURBO_ID = 'iles/turbo'

export async function bundleIslands (config: AppConfig, islandsByPath: IslandsByPath) {
  const entrypoints = Object.create(null)
  const islandComponents = Object.create(null)

  for (const path in islandsByPath) {
    islandsByPath[path].forEach((island) => {
      island.entryFilename = `${flattenPath(path)}_${island.id}`
      entrypoints[island.entryFilename] = island.script
      islandComponents[island.componentPath] = island.componentPath
    })
  }

  const entryFiles = [...Object.keys(entrypoints), ...Object.keys(islandComponents)].sort()

  if (config.turbo)
    entryFiles.push(VIRTUAL_TURBO_ID)

  if (Object.keys(entryFiles).length === 0) return

  await viteBuild(mergeViteConfig(config.vite, {
    logLevel: 'warn',
    publicDir: false,
    build: {
      emptyOutDir: false,
      manifest: true,
      minify: 'esbuild',
      rollupOptions: {
        input: entryFiles,
        output: {
          entryFileNames: chunkFileNames,
          chunkFileNames,
          manualChunks: extendManualChunks(config),
        },
      },
    },
    plugins: [
      virtualEntrypointsPlugin(config.root, entrypoints),
      IslandsPlugins(config),
    ],
  } as ViteUserConfig))
}

function virtualEntrypointsPlugin (root: string, entrypoints: Record<string, string>): Plugin {
  return {
    name: 'iles:entrypoints',
    resolveId (id, importer) {
      const entryFilename = relative(root, id.split('?', 2)[0])

      if (entryFilename in entrypoints)
        return VIRTUAL_PREFIX + entryFilename

      if (entryFilename === VIRTUAL_TURBO_ID)
        return VIRTUAL_TURBO_ID
    },
    async load (id) {
      if (id.startsWith(VIRTUAL_PREFIX))
        return entrypoints[id.slice(VIRTUAL_PREFIX.length)]

      if (id === VIRTUAL_TURBO_ID)
        return await fs.readFile(TURBO_SCRIPT_PATH, 'utf-8')
    },
  }
}

// Internal: Remove query strings from islands inside Vue components.
function chunkFileNames (chunk: PreRenderedChunk) {
  if (chunk.name.includes('.vue_vue')) return `assets/${chunk.name.split('.vue_vue')[0]}.[hash].js`
  return 'assets/[name].[hash].js'
}
