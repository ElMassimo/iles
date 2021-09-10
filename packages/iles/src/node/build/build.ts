import fs from 'fs-extra'
// import { bundle, okMark, failMark } from './bundle'
import { BuildOptions } from 'vite'
import ora from 'ora'
import { resolveConfig } from '../config'
// import { renderPage } from './render'
// import { OutputChunk, OutputAsset } from 'rollup'
import { okMark, failMark } from './utils'

export async function build (root: string, buildOptions: BuildOptions = {}) {
  const start = Date.now()

  process.env.NODE_ENV = 'production'
  const appConfig = await resolveConfig(root, { command: 'build', mode: 'production' })

  console.warn({ appConfig })

  try {
    // const [clientResult, , pageToHashMap] = await bundle(appConfig, buildOptions)

    const spinner = ora()
    spinner.start('rendering pages...')

    try {
      //   const appChunk = clientResult.output.find(
      //     (chunk) => chunk.type === 'chunk' && chunk.isEntry
      //   ) as OutputChunk

      //   const cssChunk = clientResult.output.find(
      //     (chunk) => chunk.type === 'asset' && chunk.fileName.endsWith('.css')
      //   ) as OutputAsset

      //   // We embed the hash map string into each page directly so that it doesn't
      //   // alter the main chunk's hash on every build. It's also embedded as a
      //   // string and JSON.parsed from the client because it's faster than embedding
      //   // as JS object literal.
      //   const hashMapString = JSON.stringify(JSON.stringify(pageToHashMap))

      //   for (const page of appConfig.pages) {
      //     await renderPage(
      //       appConfig,
      //       page,
      //       clientResult,
      //       appChunk,
      //       cssChunk,
      //       pageToHashMap,
      //       hashMapString
      //     )
      //   }
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
