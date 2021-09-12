import fs from 'fs-extra'
import { BuildOptions } from 'vite'
import ora from 'ora'
import { OutputChunk, OutputAsset } from 'rollup'
import { resolveConfig } from '../config'
import { renderPage } from './render'
import { bundle } from './bundle'
import { okMark, failMark } from './utils'

export async function build (root: string, buildOptions: BuildOptions = {}) {
  const start = Date.now()

  process.env.NODE_ENV = 'production'
  const appConfig = await resolveConfig(root, { command: 'build', mode: 'production' })

  try {
    const { clientResult, pages } = await bundle(appConfig, buildOptions)

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

      for (const [, page] of pages) {
        await renderPage(
          appConfig,
          page,
          clientResult,
          appChunk,
          cssChunk,
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
