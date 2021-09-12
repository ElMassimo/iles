/* eslint-disable no-restricted-syntax */
import { resolve } from 'path'
import type { RollupOutput } from 'rollup'
import type { Plugin } from 'vite'
import { build, BuildOptions, mergeConfig as mergeViteConfig, UserConfig as ViteUserConfig } from 'vite'
import { resolvePages, resolveOptions as resolvePageOptions } from 'vite-plugin-pages'
import { APP_PATH } from '../alias'
import { AppConfig } from '../shared'
import IslandsPlugins from '../plugin'
import { fileToAssetName } from './utils'

type Entrypoints = Record<string, string>

// Internal: Bundles the Islands app for both client and server.
//
// Multi-entry build: every page is considered an entry chunk.
export async function bundle (config: AppConfig) {
  const entrypoints = await resolveEntrypoints(config)

  const [clientResult, serverResult] = await Promise.all([
    bundleWithVite(config, entrypoints, { ssr: false }),
    bundleWithVite(config, entrypoints, { ssr: true }),
  ])

  return { clientResult, serverResult }
}

async function bundleWithVite (config: AppConfig, entrypoints: Entrypoints, { ssr }: BuildOptions) {
  return await build(mergeViteConfig(config.vite, {
    logLevel: 'warn',
    ssr: {
      external: ['vue', '@vue/server-renderer'],
      noExternal: ['iles'],
    },
    plugins: [...IslandsPlugins(config), !ssr && removeJsPlugin()],
    build: {
      ssr,
      minify: ssr ? false : 'esbuild',
      emptyOutDir: true,
      outDir: ssr ? config.tempDir : config.outDir,
      rollupOptions: {
        input: entrypoints,
        preserveEntrySignatures: 'allow-extension',
      },
    },
  } as ViteUserConfig)) as RollupOutput
}

// Internal: Each page is treated as an entrypoint, so that stylesheets can be
// added separately as needed.
async function resolveEntrypoints (config: AppConfig) {
  const entrypoints: Entrypoints = {
    app: resolve(APP_PATH, 'index.js'),
  }
  const pages = await resolvePages(resolvePageOptions(config.pages, config.root))
  pages.forEach(page => {
    entrypoints[fileToAssetName(page.route)] = page.filepath
  })
  return entrypoints
}

function removeJsPlugin (): Plugin {
  return {
    name: 'iles:client-js-removal',
    generateBundle (_, bundle) {
      for (const name in bundle) {
        const chunk = bundle[name]
        console.log('chunk', name, chunk.fileName)
        if (chunk.fileName.endsWith('.js')) delete bundle[name]
      }
    },
  }
}
