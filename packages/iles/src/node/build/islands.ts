/* eslint-disable no-restricted-syntax */
import path from 'path'
import { promises as fs } from 'fs'
import ora from 'ora'
import virtual from '@rollup/plugin-virtual'
import { build as viteBuild } from 'vite'
import glob from 'fast-glob'
import type { Manifest } from 'vite'
import IslandsPlugins from '../plugin'
import { AppConfig, IslandDefinition } from '../shared'
import { rebaseImports } from '../plugin/parse'
import { okMark, failMark, SSGRoute, fileToAssetName, replaceAsync, uniq } from './utils'

const scriptTagsRegex = /<script\s*([^>]*?)>(.*?)<\/script>/sg

export async function bundleIslands (config: AppConfig, routes: SSGRoute[], islandsByPath: Record<string, IslandDefinition[]>) {
  const islandScripts = Object.values(islandsByPath).flat()
  if (islandScripts.length === 0) return

  const spinner = ora()
  spinner.start(`building islands bundle... (${islandScripts.length} total)`)
  try {
    // const assetsBase = path.join(config.base, config.assetsDir)

    // Remove unnecessary client scripts.
    const files = await glob(path.join(config.outDir, '**/*.js'))
    files.forEach(fileName => fs.rm(fileName))

    const entrypoints = Object.create(null)

    for (const path in islandsByPath) {
      islandsByPath[path].forEach((island) => {
        island.entryFilename = fileToAssetName(`${path}/${island.id}`)
        entrypoints[island.entryFilename] = island.script
      })
    }

    await viteBuild({
      publicDir: false,
      build: {
        minify: 'esbuild',
        brotliSize: true,
        emptyOutDir: false,
        manifest: true,
        rollupOptions: {
          input: Object.keys(entrypoints),
        },
      },
      plugins: [
        ...IslandsPlugins(config),
        virtual(entrypoints),
      ],
    })
    const manifest: Manifest = JSON.parse(await fs.readFile(path.join(config.outDir, 'manifest.json'), 'utf-8'))

    console.log({ manifest })

    const assetsBase = path.resolve(config.outDir, 'assets')

    await Promise.all(routes.map(async (route) => {
      let content = route.content!
      if (route.extension === 'html') {
        content = removeJS(content)

        const islands = islandsByPath[route.path]
        const preloadScripts: string[] = []
        for (const island of islands) {
          const entry = manifest[path.relative(config.root, island.entryFilename)]
          if (entry.imports) preloadScripts.push(...entry.imports)
          const filename = path.join(config.outDir, entry.file)
          const code = await fs.readFile(filename, 'utf-8')
          const rebasedCode = await rebaseImports(assetsBase, code)
          content = content.replace(island.placeholder,
            `<script type="module">${rebasedCode}</script>`)
        }
        content = content.replace('</head>', `${stringifyPreload(config.base, manifest, preloadScripts)}</head>`)
      }

      const filename = path.resolve(config.outDir, route.outputFilename)
      await fs.mkdir(path.dirname(filename), { recursive: true })
      await fs.writeFile(filename, content, 'utf-8')
    }))
  }
  catch (e) {
    spinner.stopAndPersist({ symbol: failMark })
    throw e
  }
  spinner.stopAndPersist({ symbol: okMark })
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

function removeJS (html: string) {
  html.replace(scriptTagsRegex, (script: string, attrs: string) => {
    return !attrs.includes('client-keep') && attrs.includes('type="module"') && attrs.includes(`src="${assetsBase}`)
      ? ''
      : script
  })
  html = html.replace(/<link\s*([^>]*?)>/sg, (link: string, attrs: string) => {
    if (attrs.includes('modulepreload') && attrs.includes('.js')) return ''
    return link
  })
  return html
}
