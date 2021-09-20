import { promises as fs } from 'fs'
import { resolveConfig } from '../config'
import { renderPages } from './render'
import { bundle } from './bundle'
import { bundleIslands } from './islands'
import { withSpinner } from './utils'
import { createSitemap } from './sitemap'

export async function build (root: string) {
  const start = Date.now()

  process.env.NODE_ENV = 'production'
  const appConfig = await resolveConfig(root, { command: 'build', mode: 'production' })

  try {
    const bundleResult = await withSpinner('building client + server bundles',
      async () => await bundle(appConfig))

    const islandsByPath = Object.create(null)

    const pagesResult = await withSpinner('rendering pages',
      async () => await renderPages(appConfig, islandsByPath, bundleResult))

    await createSitemap(appConfig, pagesResult.routesToRender)

    await withSpinner('building islands bundle',
      async () => await bundleIslands(appConfig, islandsByPath, pagesResult))
  }
  finally {
    await fs.rm(appConfig.tempDir, { recursive: true, force: true })
  }

  console.info(`build complete in ${((Date.now() - start) / 1000).toFixed(2)}s.`)
}
