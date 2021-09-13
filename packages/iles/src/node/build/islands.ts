/* eslint-disable no-restricted-syntax */
import path from 'path'
import { promises as fs } from 'fs'
import virtual from '@rollup/plugin-virtual'
import { build as viteBuild, mergeConfig as mergeViteConfig } from 'vite'
import glob from 'fast-glob'
import type { Manifest, UserConfig as ViteUserConfig } from 'vite'
import IslandsPlugins from '../plugin'
import type { Awaited, AppConfig, IslandsByPath, IslandDefinition, SSGRoute } from '../shared'
import rebaseImports from './rebaseImports'
import { fileToAssetName, uniq } from './utils'
import type { renderPages } from './render'

export async function bundleIslands (
  config: AppConfig,
  islandsByPath: IslandsByPath,
  { routesToRender }: Awaited<ReturnType<typeof renderPages>>,
) {
  await buildIslands(config, islandsByPath)
  const manifestPath = path.join(config.outDir, 'manifest.json')
  const manifest: Manifest = JSON.parse(await fs.readFile(manifestPath, 'utf-8'))

  await Promise.all(routesToRender.map(async route =>
    await renderRoute(config, manifest, route, islandsByPath[route.path])))

  // Remove temporary island script files.
  const tempIslandFiles = await glob(path.join(config.outDir, '**/_virtual_*.js'))
  for (const temp of tempIslandFiles) await fs.rm(temp)
}

async function renderRoute (config: AppConfig, manifest: Manifest, route: SSGRoute, islands: IslandDefinition[] = []) {
  let content = route.rendered!

  if (route.extension === '.html') {
    const preloadScripts: string[] = []

    for (const island of islands) {
      // Find the corresponding entrypoint for the island.
      const entry = manifest[`\x00virtual:${path.relative(config.root, island.entryFilename!)}`]
      if (entry.imports) preloadScripts.push(...entry.imports)

      // Read the compiled code for the island.
      const filename = path.resolve(config.outDir, entry.file)
      const code = await fs.readFile(filename, 'utf-8')

      // Inline the script in the SSR'ed html to load the island.
      const rebasedCode = await rebaseImports(config, code)
      content = content.replace(`<!--${island.placeholder}-->`,
        `<script type="module">${rebasedCode}</script>`)
    }

    // Preload scripts for islands in the page.
    content = content.replace('</head>', `${stringifyPreload(config.base, manifest, preloadScripts)}</head>`)
  }

  const filename = path.resolve(config.outDir, route.outputFilename)
  await fs.mkdir(path.dirname(filename), { recursive: true })
  await fs.writeFile(filename, content, 'utf-8')
}

async function buildIslands (config: AppConfig, islandsByPath: IslandsByPath) {
  const entrypoints = Object.create(null)

  for (const path in islandsByPath) {
    islandsByPath[path].forEach((island) => {
      island.entryFilename = fileToAssetName(`${path}/${island.id}`)
      entrypoints[island.entryFilename] = island.script
    })
  }

  const entryFiles = Object.keys(entrypoints)
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
      },
    },
    plugins: [
      await IslandsPlugins(config),
      virtual(entrypoints),
    ],
  } as ViteUserConfig))
}

function stringifyPreload (base: string, manifest: Manifest, hrefs: string[]) {
  return uniq(resolveManifestEntries(manifest, hrefs))
    .map(href => `<link rel="modulepreload" href="${path.join(base, href)}" crossorigin/>`)
    .join('')
}

function resolveManifestEntries (manifest: Manifest, entryNames: string[]): string[] {
  return entryNames.flatMap((entryName) => {
    const entry = manifest[entryName]
    return [entry.file, ...resolveManifestEntries(manifest, entry.imports || [])]
  })
}