import fs from 'fs'
import ssgBuild from '@mussi/vite-ssg/build'
import { BuildOptions } from 'vite'
import { resolveConfig } from './config'

export async function build (options: BuildOptions = {}) {
  const start = Date.now()

  process.env.NODE_ENV = 'production'
  const config = await resolveConfig(options, 'build', 'production')

  try {
    const [clientResult, , pageToHashMap] = await ssgBuild(config)
  } finally {
    await fs.rmSync(config.viteIslands.tempDir, { recursive: true, force: true })
  }

  const secondsEllapsed = (Date.now() - start) / 1000
  console.log(`build complete in ${secondsEllapsed.toFixed(2)}s.`)
}
