import type { Manifest, PluginOption, ResolvedConfig, ResolveFn } from 'vite'

function resolveManifestEntries (manifest: Manifest, entryNames: string[]): string[] {
  return entryNames.flatMap((entryName) => {
    const entry = manifest[entryName]
    return [entry.file, ...resolveManifestEntries(manifest, entry.imports || [])]
  })
}

import { build as viteBuild } from 'vite'
import type { ViteSSGOptions } from '@mussi/vite-ssg'
import { escapeRegex, pascalCase, uniq } from './utils'
import glob from 'fast-glob'
import chalk from 'chalk'
let islandsConfig: AppConfig
import { parseImports, rebaseImports } from './parse'

function stringifyPreload (manifest: Manifest, hrefs: string[]) {
  return uniq(resolveManifestEntries(manifest, hrefs))
    .map(href => `<link rel="modulepreload" href="${path.join(base, href)}" crossorigin/>`)
    .join('')
}

function filenameFromRoute (route: string) {
  const relativeRoute = (route.endsWith('/') ? `${route}index` : route).replace(/^\//g, '')
  const filename = `${relativeRoute}.html`
  return path.join(outDir, filename)
}

function buildLog (text: string, count: number | undefined) {
  console.log(`
${chalk.gray('[islands]')} ${chalk.yellow(text)}${count ? chalk.blue(` (${count})`) : ''}`)
}

const hydrationBegin = '<!--VITE_ISLAND_HYDRATION_BEGIN-->'
const hydrationEnd = '<!--VITE_ISLAND_HYDRATION_END-->'
// const slotBegin = '<!--VITE_ISLAND_SLOT_BEGIN-->'
// const slotSeparator = 'VITE_ISLAND_SLOT_SEPARATOR'
const commentsRegex = /<!--\[-->|<!--]-->/g
const hydrationRegex = new RegExp(`${escapeRegex(hydrationBegin)}(.*?)${escapeRegex(hydrationEnd)}`, 'sg')
const islandsByRoute: Record<string, string[]> = Object.create(null)

function config (config: ViteConfig) {
  return {
    ssgOptions: {
      async onPageRendered (route, html) {
        let counter = 0
        const pageIslands: string[] = []
        const assetsBase = path.join(base, assetsDir)
        const pageOutDir = path.resolve(islandsConfig.tempDir, route === '/' ? 'index' : route.replace(/^\//, '').replace(/\//g, '-'))
        fs.mkdirSync(pageOutDir, { recursive: true })
        html = html.replace(scriptTagsRegex, (script: string, attrs: string) => {
          return !attrs.includes('client-keep') && attrs.includes('type="module"') && attrs.includes(`src="${assetsBase}`)
            ? ''
            : script
        })
        html = html.replace(/<link\s*([^>]*?)>/sg, (link: string, attrs: string) => {
          if (attrs.includes('modulepreload') && attrs.includes('.js')) return ''
          return link
        })
        html = await replaceAsync(html, hydrationRegex, async (str, islandHydrationScript) => {
          const basename = `vite-island-${++counter}.js`
          const filename = path.join(pageOutDir, basename)
          // const [scriptTemplate, ...slotStrs] = islandHydrationScript.replace(commentsRegex, '').split(slotBegin)
          // const slots = Object.fromEntries(slotStrs.map(str => str.split(slotSeparator)))
          // const script = scriptTemplate.replace('/* VITE_ISLAND_HYDRATION_SLOTS */', slotStrs.length ? serialize(slots) : '')
          const script = islandHydrationScript.replace(commentsRegex, '')
          await fs.promises.writeFile(filename, script, 'utf-8')
          pageIslands.push(filename)
          return `${hydrationBegin}${filename}${hydrationEnd}`
        })
        if (pageIslands.length) {
          islandsByRoute[route] = pageIslands
          logger.warn(`${chalk.dim(`${path.relative(islandsConfig.tempDir, pageOutDir)}`)} ${chalk.green(` (${pageIslands.length})`)}`)
        }
        else {
          logger.warn(`${chalk.dim(`${path.relative(islandsConfig.tempDir, pageOutDir)}`)} ${chalk.yellow(' no islands')}`)
        }
        return html
      },
      async onFinished () {
        const islandFiles = Object.values(islandsByRoute).flat()
        if (islandFiles.length === 0) return

        buildLog('Build for islands...', islandFiles.length)

        const assetsBase = path.join(base, assetsDir)

        // Remove unnecessary client scripts.
        const files = await glob(path.join(outDir, '**/*.js'))
        files.forEach(fileName => fs.promises.rm(fileName))

        await viteBuild({
          publicDir: false,
          build: {
            minify: 'esbuild',
            brotliSize: true,
            emptyOutDir: false,
            manifest: true,
            outDir,
            rollupOptions: {
              input: islandFiles,
            },
          },
          mode,
        })
        const manifest: Manifest = JSON.parse(fs.readFileSync(path.join(outDir, 'manifest.json'), 'utf-8'))

        await Promise.all(Object.keys(islandsByRoute).map(async (route) => {
          const htmlFilename = filenameFromRoute(route)

          let html = await fs.promises.readFile(htmlFilename, 'utf-8')
          const preloadScripts: string[] = []
          html = await replaceAsync(html, hydrationRegex, async (str, file) => {
            const entry = manifest[path.relative(root, file)]
            if (entry.imports) preloadScripts.push(...entry.imports)

            const filename = path.join(outDir, entry.file)
            const code = await fs.promises.readFile(filename, 'utf-8')
            const rebasedCode = await rebaseImports(assetsBase, code)

            fs.promises.rm(filename)

            return `<script type="module">${rebasedCode}</script>`
          })
          html = html.replace('</head>', `${stringifyPreload(manifest, preloadScripts)}</head>`)
          await fs.promises.writeFile(htmlFilename, html, 'utf-8')
        }))
        fs.rmSync(islandsConfig.tempDir, { recursive: true, force: true })
      },
    } as ViteSSGOptions,
  }
}
