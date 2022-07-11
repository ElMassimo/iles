import { resolveConfig } from '../config'
import { renderPages } from './render'
import { bundle } from './bundle'
import { bundleIslands } from './islands'
import { writePages } from './write'
import { withSpinner, rm } from './utils'
import { createSitemap } from './sitemap'

export async function build (root: string) {
  const start = Date.now()

  process.env.NODE_ENV = 'production'
  const appConfig = await resolveConfig(root, { command: 'build', mode: 'production', ssrBuild: false })

  rm(appConfig.outDir)

  const bundleResult = await withSpinner('building client + server bundles',
    async () => await bundle(appConfig))

  const islandsByPath = Object.create(null)

  const pagesResult = await renderPages(appConfig, islandsByPath, bundleResult)

  await createSitemap(appConfig, pagesResult.routesToRender)

  await withSpinner('building islands bundle',
    async () => await bundleIslands(appConfig, islandsByPath))

  const ssgContext = { config: appConfig, pages: pagesResult.routesToRender }

  await appConfig.ssg.onSiteBundled?.(ssgContext)

  await withSpinner('writing pages',
    async () => await writePages(appConfig, islandsByPath, pagesResult))

  await appConfig.ssg.onSiteRendered?.(ssgContext)

  rm(appConfig.tempDir)

  console.info(`build complete in ${((Date.now() - start) / 1000).toFixed(2)}s.`)
}
