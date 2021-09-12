import { join } from 'path'
import fs from 'fs-extra'
import { BuildOptions } from 'vite'
import ora from 'ora'
import { OutputChunk, OutputAsset } from 'rollup'
import { resolveConfig } from '../config'
import { renderPage } from './render'
import { bundle } from './bundle'
import { okMark, failMark, routesToPaths } from './utils'
import { CreateAppFactory } from '../shared'

export async function build (root: string, buildOptions: BuildOptions = {}) {
  const start = Date.now()

  process.env.NODE_ENV = 'production'
  const appConfig = await resolveConfig(root, { command: 'build', mode: 'production' })

  try {
    const { clientResult } = await bundle(appConfig, buildOptions)

    const spinner = ora()
    spinner.start('rendering pages...')

    try {
      const appChunk = clientResult.output.find(
        chunk => chunk.type === 'chunk' && chunk.isEntry,
      ) as OutputChunk

      const cssChunk = clientResult.output.find(
        chunk => chunk.type === 'asset' && chunk.fileName.endsWith('.css'),
      ) as OutputAsset

      const islandsByPath = Object.create(null)

      const { createApp }: { createApp: CreateAppFactory} = require(join(appConfig.tempDir, 'app.js'))

      const { routes } = await createApp()

      const routesPaths = routesToPaths(routes)
        .filter(({ path }) => !path.includes(':') && !path.includes('*'))

      for (const routePath of routesPaths) {
        await renderPage(
          appConfig,
          routePath,
          clientResult,
          appChunk,
          cssChunk,
          createApp,
          islandsByPath,
        )
      }

      console.log({ islandsByPath })
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
