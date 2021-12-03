import { resolveConfig } from '../config'
import { renderPages } from './render'
import { bundle } from './bundle'
import { bundleIslands } from './islands'
import { withSpinner, rm } from './utils'
import { createSitemap } from './sitemap'

export async function build (root: string) {
  const start = Date.now()

  process.env.NODE_ENV = 'production'
  const appConfig = await resolveConfig(root, { command: 'build', mode: 'production' })

  rm(appConfig.outDir)

  const bundleResult = await withSpinner('building client + server bundles',
    async () => await bundle(appConfig))

  const islandsByPath = Object.create(null)

  const pagesResult = await renderPages(appConfig, islandsByPath, bundleResult)

  await createSitemap(appConfig, pagesResult.routesToRender)

  await withSpinner('building islands bundle',
    async () => await bundleIslands(appConfig, islandsByPath, pagesResult))

  appConfig.ssg.onSiteRendered({
    config: appConfig,
    pages: pagesResult.routesToRender,
  })

  rm(appConfig.tempDir)

  console.info(`build complete in ${((Date.now() - start) / 1000).toFixed(2)}s.`)
}
