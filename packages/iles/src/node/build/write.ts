/* eslint-disable no-restricted-syntax */
import { promises as fs } from 'fs'
import { join, resolve, dirname } from 'pathe'
import glob from 'fast-glob'
import type { Manifest } from 'vite'
import type { Awaited, AppConfig, IslandsByPath, IslandDefinition, RouteToRender } from '../shared'
import rebaseImports from './rebaseImports'
import { uniq } from './utils'
import type { renderPages } from './render'

import { VIRTUAL_PREFIX, VIRTUAL_TURBO_ID } from './islands'

export async function writePages (
  config: AppConfig,
  islandsByPath: IslandsByPath,
  { routesToRender }: Awaited<ReturnType<typeof renderPages>>,
) {
  const manifest: Manifest = await parseManifest(config.outDir, islandsByPath)

  await Promise.all(routesToRender.map(async route =>
    await writeRoute(config, manifest, route, islandsByPath[route.path])))

  const tempIslandFiles = await glob(join(config.outDir, `**/${VIRTUAL_PREFIX}*.js`))
  // Remove temporary island script files.
  for (const temp of tempIslandFiles) await fs.unlink(temp)
}

async function writeRoute (config: AppConfig, manifest: Manifest, route: RouteToRender, islands: IslandDefinition[] = []) {
  let content = route.rendered

  if (route.outputFilename.endsWith('.html')) {
    const preloadScripts: string[] = []

    for (const island of islands) {
      const entry = manifest[`${VIRTUAL_PREFIX}${island.entryFilename!}`]
      // Find the corresponding entrypoint for the island.

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
        () => `<script></script><script type="module" async>${rebasedCode}</script>`)
    }

    // Preload scripts for islands in the page.
    route.rendered = content.replace('</head>', () => `${stringifyScripts(config, manifest, preloadScripts)}</head>`)
  }

  route = await config.ssg.beforePageRender?.(route, config) || route

  const filename = resolve(config.outDir, route.outputFilename)
  await fs.mkdir(dirname(filename), { recursive: true })
  await fs.writeFile(filename, route.rendered, 'utf-8')
}

function stringifyScripts ({ turbo, base }: AppConfig, manifest: Manifest, hrefs: string[]) {
  return [
    turbo && injectNavigation(base, manifest),
    stringifyPreload(base, manifest, hrefs),
  ].filter(x => x).join('')
}

function injectNavigation (base: string, manifest: Manifest) {
  const src = manifest[VIRTUAL_TURBO_ID]?.file
  return src && `<script type="module" async src="${base}${src}"></script>`
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
  const manifestPath = join(outDir, '.vite', 'manifest.json')
  try {
    return JSON.parse(await fs.readFile(manifestPath, 'utf-8'))
  }
  catch (err) {
    if (Object.keys(islandsByPath).length > 0) throw err
    return {}
  }
}
