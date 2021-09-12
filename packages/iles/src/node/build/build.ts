import { join } from 'path'
import fs from 'fs-extra'
import { BuildOptions } from 'vite'
import ora from 'ora'
import { resolveConfig } from '../config'
import { CreateAppFactory } from '../shared'
import { renderPage } from './render'
import { bundle } from './bundle'
import { bundleIslands } from './islands'
import { okMark, failMark, routesToPaths } from './utils'

export async function build (root: string, buildOptions: BuildOptions = {}) {
  const start = Date.now()

  process.env.NODE_ENV = 'production'
  const appConfig = await resolveConfig(root, { command: 'build', mode: 'production' })

  try {
    const { clientResult } = await bundle(appConfig, buildOptions)

    const spinner = ora()
    spinner.start('rendering pages...')

    try {
      const islandsByPath = Object.create(null)

      const { createApp }: { createApp: CreateAppFactory} = require(join(appConfig.tempDir, 'app.js'))

      const { routes } = await createApp()

      const ssgRoutes = routesToPaths(routes)
        .filter(({ path }) => !path.includes(':') && !path.includes('*'))

      for (const ssgRoute of ssgRoutes)
        ssgRoute.content = await renderPage(appConfig, ssgRoute, clientResult, createApp, islandsByPath)

      await bundleIslands(appConfig, ssgRoutes, islandsByPath)
    }
    catch (e) {
      spinner.stopAndPersist({ symbol: failMark })
      throw e
    }
    spinner.stopAndPersist({ symbol: okMark })
  }
  finally {
    await fs.remove(appConfig.tempDir)
  }

  console.log(`build complete in ${((Date.now() - start) / 1000).toFixed(2)}s.`)
}
