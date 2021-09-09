import { join, dirname, resolve, isAbsolute } from 'path'
import type { BuildOptions } from 'vite'
import chalk from 'chalk'
import fs from 'fs-extra'
import { build as viteBuild, resolveConfig, ResolvedConfig } from 'vite'
import { renderToString, SSRContext } from '@vue/server-renderer'
import { JSDOM, VirtualConsole } from 'jsdom'
import { RollupOutput } from 'rollup'
import type { VitePluginPWAAPI } from 'vite-plugin-pwa'
import readPkgUp from 'read-pkg-up'
import type { CreateAppFactory } from '../shared'
import { APP_PATH } from '../alias'
import { renderPreloadLinks } from './preload-links'
import { buildLog, routesToPaths, getSize } from './utils'
import { getCritters } from './critical'

export async function build (options: BuildOptions) {
  const start = Date.now()

  process.env.NODE_ENV = 'production'
  const config = await resolveConfig(options, 'build', 'production')

  await ssgBuild(config)

  const secondsEllapsed = (Date.now() - start) / 1000
  console.log(`build complete in ${secondsEllapsed.toFixed(2)}s.`)
}

export interface Manifest {
  [key: string]: string[]
}

function DefaultIncludedRoutes (paths: string[]) {
  // ignore dynamic routes
  return paths.filter(i => !i.includes(':') && !i.includes('*'))
}
export default async function ssgBuild (config: ResolvedConfig) {
  const root = config.root || process.cwd()
  const ssgOut = join(root, '.vite-ssg-temp')
  const outDir = config.build.outDir || 'dist'
  const out = isAbsolute(outDir) ? outDir : join(root, outDir)
  const isTypeModule = (await readPkgUp({ cwd: root }))?.packageJson.type === 'module'

  const {
    script = 'sync',
    mock = false,
    crittersOptions = {},
    includedRoutes = DefaultIncludedRoutes,
    onBeforePageRender,
    onPageRendered,
    onFinished,
  } = Object.assign({}, config.ssgOptions || {})

  if (fs.existsSync(ssgOut))
    await fs.remove(ssgOut)

  // client
  buildLog('Build for client...')
  await viteBuild({
    build: {
      ssrManifest: true,
      rollupOptions: {
        input: {
          app: join(root, './index.html'),
        },
      },
    },
    mode: config.mode,
  }) as RollupOutput

  // server
  buildLog('Build for server...')
  process.env.VITE_SSG = 'true'
  await viteBuild({
    build: {
      ssr: resolve(APP_PATH, 'index.js'),
      outDir: ssgOut,
      minify: false,
      cssCodeSplit: false,
      rollupOptions: {
        output: {
          entryFileNames: `[name].${isTypeModule ? 'cjs' : 'js'}`,
        },
      },
    },
    mode: config.mode,
  })

  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { createApp } = require(join(ssgOut, `main.${isTypeModule ? 'cjs' : 'js'}`)) as { createApp: CreateAppFactory }

  const { routes, initialState } = await createApp({ inBrowser: false })

  let routesPaths = await includedRoutes(routesToPaths(routes))
  // uniq
  routesPaths = Array.from(new Set(routesPaths))

  buildLog('Rendering Pages...', routesPaths.length)

  const critters = crittersOptions !== false ? getCritters(outDir, crittersOptions) : undefined
  if (critters)
    console.log(`${chalk.gray('[vite-ssg]')} ${chalk.blue('Critical CSS generation enabled via `critters`')}`)

  if (mock) {
    const virtualConsole = new VirtualConsole()
    const jsdom = new JSDOM('', { url: 'http://localhost', virtualConsole })
    // @ts-ignore
    global.window = jsdom.window
    Object.assign(global, jsdom.window)
  }

  const ssrManifest: Manifest = JSON.parse(await fs.readFile(join(out, 'ssr-manifest.json'), 'utf-8'))
  let indexHTML = await fs.readFile(join(out, 'index.html'), 'utf-8')
  indexHTML = rewriteScripts(indexHTML, script)

  await Promise.all(
    routesPaths.map(async (routePath) => {
      const { app, router, head } = await createApp({ inBrowser: false, routePath })

      if (router) {
        await router.push(routePath)
        await router.isReady()
      }

      const transformedIndexHTML = (await onBeforePageRender?.(routePath, indexHTML)) || indexHTML

      const ctx: SSRContext = {}
      const appHTML = await renderToString(app, ctx)

      // need to resolve assets so render content first
      const renderedHTML = renderHTML({ indexHTML: transformedIndexHTML, appHTML, initialState })

      // create jsdom from renderedHTML
      const jsdom = new JSDOM(renderedHTML)

      // render current page's preloadLinks
      renderPreloadLinks(jsdom.window.document, ctx.modules || new Set<string>(), ssrManifest)

      // render head
      head?.updateDOM(jsdom.window.document)

      const html = jsdom.serialize()
      let transformed = (await onPageRendered?.(routePath, html)) || html
      if (critters)
        transformed = await critters.process(transformed)

      const formatted = transformed // format(transformed, formatting)

      const relativeRoute = (routePath.endsWith('/') ? `${routePath}index` : routePath).replace(/^\//g, '')
      const filename = `${relativeRoute}.html`

      await fs.ensureDir(join(out, dirname(relativeRoute)))
      await fs.writeFile(join(out, filename), formatted, 'utf-8')

      config.logger.info(
        `${chalk.dim(`${outDir}/`)}${chalk.cyan(filename.padEnd(15, ' '))}  ${chalk.dim(getSize(formatted))}`,
      )
    }),
  )

  await fs.remove(ssgOut)

  // when `vite-plugin-pwa` is presented, use it to regenerate SW after rendering
  const pwaPlugin: VitePluginPWAAPI = config.plugins.find(i => i.name === 'vite-plugin-pwa')?.api
  if (pwaPlugin?.generateSW) {
    buildLog('Regenerate PWA...')
    await pwaPlugin.generateSW()
  }

  console.log(`\n${chalk.gray('[vite-ssg]')} ${chalk.green('Build finished.')}`)

  onFinished?.()
}

function rewriteScripts (indexHTML: string, mode?: string) {
  if (!mode || mode === 'sync')
    return indexHTML
  return indexHTML.replace(/<script type="module" /g, `<script type="module" ${mode} `)
}

function renderHTML ({ indexHTML, appHTML, initialState }: { indexHTML: string; appHTML: string; initialState: any }) {
  const stateScript = initialState
    ? `\n<script>window.__INITIAL_STATE__=${initialState}</script>`
    : ''
  return indexHTML
    .replace(
      '<div id="app"></div>',
      `<div id="app" data-server-rendered="true">${appHTML}</div>${stateScript}`,
    )
}
