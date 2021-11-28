/* eslint-disable no-restricted-syntax */
import { promises as fs } from 'fs'
import { join, resolve, dirname } from 'pathe'
// @ts-ignore
import virtual from '@rollup/plugin-virtual'
import { build as viteBuild, mergeConfig as mergeViteConfig } from 'vite'
import glob from 'fast-glob'
import type { Manifest, UserConfig as ViteUserConfig } from 'vite'
import type { PreRenderedChunk } from 'rollup'
import IslandsPlugins from '../plugin/plugin'
import type { Awaited, AppConfig, IslandsByPath, IslandDefinition, RouteToRender } from '../shared'
import rebaseImports from './rebaseImports'
import { flattenPath, uniq } from './utils'
import { extendManualChunks } from './chunks'
import type { renderPages } from './render'

export async function bundleIslands (
  config: AppConfig,
  islandsByPath: IslandsByPath,
  { routesToRender }: Awaited<ReturnType<typeof renderPages>>,
) {
  await buildIslands(config, islandsByPath)
  const manifest: Manifest = await parseManifest(config.outDir, islandsByPath)

  await Promise.all(routesToRender.map(async route =>
    await renderRoute(config, manifest, route, islandsByPath[route.path])))

  // Remove temporary island script files.
  const tempIslandFiles = await glob(join(config.outDir, '**/_virtual_*.js'))
  for (const temp of tempIslandFiles) await fs.unlink(temp)
}

async function renderRoute (config: AppConfig, manifest: Manifest, route: RouteToRender, islands: IslandDefinition[] = []) {
  let content = route.rendered!

  if (route.outputFilename.endsWith('.html')) {
    const preloadScripts: string[] = []

    for (const island of islands) {
      // Find the corresponding entrypoint for the island.
      const entry = manifest[`\x00virtual:${island.entryFilename!}`]

      if (!entry) {
        const message = `Unable to find entry for island '${island.entryFilename}' in manifest.json`
        console.error(`${message}. Island:\n`, island, '\n\nManifest:\n', manifest)
        throw new Error(message)
      }

      if (entry.imports) preloadScripts.push(...entry.imports)

      // Read the compiled code for the island.
      const filename = resolve(config.outDir, entry.file)
      const code = await fs.readFile(filename, 'utf-8')

      // Inline the script in the SSR'ed html to load the island.
      const rebasedCode = await rebaseImports(config, code)
      content = content.replace(`<!--${island.placeholder}-->`,
        // TODO: Remove additional script tag once Firefox is fixed
        // https://bugzilla.mozilla.org/show_bug.cgi?id=1737882
        `<script></script><script type="module" async>${rebasedCode}</script>`)
    }

    // Preload scripts for islands in the page.
    content = content.replace('</head>', `${stringifyPreload(config.base, manifest, preloadScripts)}</head>`)
  }

  const filename = resolve(config.outDir, route.outputFilename)
  await fs.mkdir(dirname(filename), { recursive: true })
  await fs.writeFile(filename, content, 'utf-8')
}

async function buildIslands (config: AppConfig, islandsByPath: IslandsByPath) {
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
  if (entryFiles.length === 0) return

  await viteBuild(mergeViteConfig(config.vite, {
    logLevel: 'warn',
    publicDir: false,
    build: {
      emptyOutDir: false,
      manifest: true,
      minify: 'esbuild',
      rollupOptions: {
        input: entryFiles,
        output: { chunkFileNames, manualChunks: extendManualChunks(config) },
      },
    },
    plugins: [
      IslandsPlugins(config),
      virtual(entrypoints),
    ],
  } as ViteUserConfig))
}

function stringifyPreload (base: string, manifest: Manifest, hrefs: string[]) {
  return uniq(resolveManifestEntries(manifest, hrefs))
    .map(href => `<link rel="modulepreload" href="${base}${href}" crossorigin/>`)
    .join('')
}

function resolveManifestEntries (manifest: Manifest, entryNames: string[]): string[] {
  return entryNames.flatMap((entryName) => {
    const entry = manifest[entryName]
    return [entry.file, ...resolveManifestEntries(manifest, entry.imports || [])]
  })
}

async function parseManifest (outDir: string, islandsByPath: IslandsByPath) {
  const manifestPath = join(outDir, 'manifest.json')
  try {
    return JSON.parse(await fs.readFile(manifestPath, 'utf-8'))
  }
  catch (err) {
    if (Object.keys(islandsByPath).length > 0) throw err
    return {}
  }
}

// Internal: Remove query strings from islands inside Vue components.
function chunkFileNames (chunk: PreRenderedChunk) {
  if (chunk.name.includes('.vue_vue')) return `assets/${chunk.name.split('.vue_vue')[0]}.[hash].js`
  return 'assets/[name].[hash].js'
}
