/* eslint-disable no-restricted-syntax */
import { promises as fs } from 'fs'
import type { RollupOutput } from 'rollup'
import type { Plugin } from 'vite'
import glob from 'fast-glob'
import { relative, dirname, resolve, join } from 'pathe'
import { build, mergeConfig as mergeViteConfig, UserConfig as ViteUserConfig } from 'vite'
import { APP_PATH } from '../alias'
import { AppConfig } from '../shared'
import IslandsPlugins from '../plugin/plugin'
import { rm } from './utils'

type Entrypoints = Record<string, string>

// Internal: Bundles the Islands app for both client and server.
//
// Multi-entry build: every page is considered an entry chunk.
export async function bundle (config: AppConfig) {
  const entrypoints = resolveEntrypoints(config)

  const [clientResult, serverResult] = await Promise.all([
    bundleWithVite(config, entrypoints, { ssr: false, htmlBuild: true }),
    bundleWithVite(config, entrypoints, { ssr: true }),
    bundleHtmlEntrypoints(config),
  ])

  return { clientResult, serverResult }
}

async function bundleHtmlEntrypoints (config: AppConfig) {
  const entrypoints = glob.sync(resolve(config.pagesDir, './**/*.html'),
    { cwd: config.root, ignore: ['node_modules/**'] })

  if (entrypoints.length > 0)
    await bundleWithVite(config, entrypoints, { htmlBuild: true, ssr: false })
}

// Internal: Creates a client and server bundle.
// NOTE: The client bundle is used only to obtain styles, JS is discarded.
async function bundleWithVite (config: AppConfig, entrypoints: string[] | Entrypoints, options: { ssr: boolean; htmlBuild?: boolean }) {
  const { htmlBuild = false, ssr } = options

  return await build(mergeViteConfig(config.vite, {
    logLevel: config.vite.logLevel ?? 'warn',
    ssr: {
      external: ['vue', 'vue/server-renderer'],
      noExternal: ['iles'],
    },
    plugins: [
      IslandsPlugins(config),
      htmlBuild
        ? moveHtmlPagesPlugin(config)
        : !ssr && removeJsPlugin(),
      ssr && addESMPackagePlugin(config),
    ],
    build: {
      ssr,
      cssCodeSplit: htmlBuild,
      minify: ssr ? false : 'esbuild',
      emptyOutDir: ssr,
      outDir: ssr ? config.tempDir : config.outDir,
      sourcemap: false,
      rollupOptions: {
        input: entrypoints,
        preserveEntrySignatures: htmlBuild ? undefined : 'allow-extension',
        treeshake: htmlBuild,
      },
    },
  } as ViteUserConfig)) as RollupOutput
}

// Internal: Currently SSG supports a single stylesheet for all pages.
function resolveEntrypoints (config: AppConfig): Entrypoints {
  return { app: APP_PATH }
}

// Internal: Removes any client JS files from the bundle, islands will be used
// instead, which are bundled in a separate build.
function removeJsPlugin (): Plugin {
  return {
    name: 'iles:client-js-removal',
    generateBundle (_, bundle) {
      for (const name in bundle)
        if (bundle[name].fileName.endsWith('.js')) delete bundle[name]
    },
  }
}

// Internal: Moves any HTML entrypoints to the correct location in the output dir.
function moveHtmlPagesPlugin (config: AppConfig): Plugin {
  return {
    name: 'iles:html-pages',
    async writeBundle (options, bundle) {
      const outDir = resolve(config.root, config.outDir)
      await Promise.all(Object.entries(bundle).map(async ([name, chunk]) => {
        if (name.endsWith('.html')) {
          const dest = resolve(outDir, relative(config.pagesDir, resolve(config.root, name)))
          await fs.mkdir(dirname(dest), { recursive: true })
          await fs.rename(resolve(outDir, name), dest)
        }
      }))
      rm(resolve(outDir, relative(config.root, config.srcDir)))
    },
  }
}

// Internal: Add a `package.json` file specifying the type of files as MJS.
function addESMPackagePlugin (config: AppConfig) {
  return {
    name: 'iles:add-common-js-package-plugin',
    async writeBundle () {
      await fs.writeFile(join(config.tempDir, 'package.json'), JSON.stringify({ type: 'module' }))
    },
  }
}
