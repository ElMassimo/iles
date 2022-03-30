/* eslint-disable no-restricted-syntax */
import { promises as fs } from 'fs'
import type { RollupOutput, OutputChunk } from 'rollup'
import type { ChunkMetadata, Plugin } from 'vite'
import glob from 'fast-glob'
import { relative, dirname, resolve, join } from 'pathe'
import { build, mergeConfig as mergeViteConfig, UserConfig as ViteUserConfig } from 'vite'
import { APP_PATH } from '../alias'
import { AppConfig } from '../shared'
import IslandsPlugins from '../plugin/plugin'
import { rm, uniq } from './utils'

type Entrypoints = Record<string, string>
export type CssDeps = Record<string, string[]>

// Internal: Bundles the Islands app for both client and server.
//
// Multi-entry build: every page is considered an entry chunk.
export async function bundle (config: AppConfig) {
  const [cssDependencies] = await Promise.all([
    bundleAppCss(config),
    bundleWithVite(config, { app: APP_PATH }, { ssr: true }),
    bundleHtmlEntrypoints(config),
  ])

  return { cssDependencies }
}

async function bundleAppCss (config: AppConfig) {
  const cssDependencies: CssDeps = {}
  const extensions = config.pageExtensions || ['vue', 'md', 'mdx']
  const entrypoints = await glob(resolve(config.pagesDir, `./**/*.{${extensions.join(',')}}`), { onlyFiles: true })
  await bundleWithVite(config, entrypoints, { ssr: false, cssDependencies })
  return cssDependencies
}

async function bundleHtmlEntrypoints (config: AppConfig) {
  const entrypoints = await glob(resolve(config.pagesDir, './**/*.html'),
    { cwd: config.root, ignore: ['node_modules/**'] })

  if (entrypoints.length > 0)
    await bundleWithVite(config, entrypoints, { htmlBuild: true, ssr: false })
}

// Internal: Creates a client and server bundle.
// NOTE: The client bundle is used only to obtain styles, JS is discarded.
async function bundleWithVite (config: AppConfig, entrypoints: string[] | Entrypoints, options: { ssr: boolean; htmlBuild?: boolean, cssDependencies?: CssDeps }) {
  const { htmlBuild = false, ssr } = options
  const isCssBuild = !htmlBuild && !ssr

  return await build(mergeViteConfig(config.vite, {
    logLevel: 'warn',
    ssr: {
      external: ['vue', '@vue/server-renderer'],
      noExternal: ['iles'],
    },
    plugins: [
      IslandsPlugins(config),
      isCssBuild && extractCssPlugin(config, options.cssDependencies!),
      htmlBuild && moveHtmlPagesPlugin(config),
      ssr && addCommonJsPackagePlugin(config),
    ],
    build: {
      ssr,
      minify: ssr ? false : 'esbuild',
      emptyOutDir: ssr,
      outDir: ssr ? config.tempDir : config.outDir,
      sourcemap: false,
      rollupOptions: {
        input: entrypoints,
        preserveEntrySignatures: htmlBuild ? undefined : 'allow-extension',
      },
    },
  } as ViteUserConfig)) as RollupOutput
}

// Internal: Removes any client JS files from the bundle, islands will be used
// instead, which are bundled in a separate build.
function extractCssPlugin (config: AppConfig, cssDependencies: CssDeps): Plugin[] {
  return [
    {
      name: 'iles:css:shims',
      enforce: 'pre',
      async resolveId (id) {
        const external = ['iles/turbo.js', 'iles/jsx-runtime', 'iles/dist', 'plugin-vue:export-helper', '@vue/', 'vue-demi', 'preact', 'svelte', 'solid-js']
        if (external.some(f => id.includes(f)))
          return { id: 'client-shim', external: true }
      },
    },
    {
      name: 'iles:css:extract',
      enforce: 'post',
      transform (code, id) {
        if (config.namedPlugins.pages.api.isPage(id))
          return `import '@islands/user-app';import '@islands/user-site';${code}`
      },
      generateBundle (_, bundle) {
        const allChunks = bundle as Record<string, OutputChunk>
        const routes = config.namedPlugins.pages.api.pageRoutes

        const chunksByFile = groupBy(Object.values(bundle) as OutputChunk[], (chunk: OutputChunk) => chunk.facadeModuleId)

        const extractCssDependencies = (chunks: (OutputChunk | undefined)[]): string[] => {
          if (!chunks) return []
          return chunks.flatMap(chunk => chunk ? [
            ...((chunk as any).viteMetadata as ChunkMetadata).importedCss,
            ...extractCssDependencies(chunk.imports.map(key => allChunks[key])),
          ] : [])
        }

        routes.forEach((route) => {
          cssDependencies[route.path]
            = uniq(extractCssDependencies(chunksByFile[route.componentFilename]))
        })

        for (const name in bundle)
          if (bundle[name].fileName.endsWith('.js'))
            delete bundle[name]
      },
    }
  ]
}

function groupBy<T> (items: T[], fn: (arg: T) => any): Record<string, T[]> {
  return items.reduce((itemsByGroup, item) => {
    const val = fn(item)
    if (val) (itemsByGroup[val] ||= []).push(item)
    return itemsByGroup
  }, {} as Record<string, T[]>)
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

// Internal: Add a `package.json` file specifying the type of files as CJS.
function addCommonJsPackagePlugin (config: AppConfig) {
  return {
    name: 'iles:add-common-js-package-plugin',
    async writeBundle () {
      await fs.writeFile(join(config.tempDir, 'package.json'), JSON.stringify({ type: 'commonjs' }))
    },
  }
}
