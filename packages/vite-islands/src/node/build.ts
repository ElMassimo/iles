import fs from 'fs'
import { resolveConfig } from 'vite'
import type { BuildOptions } from 'vite'

import ssgBuild from '@mussi/vite-ssg/build'
import ViteIslandsPlugin from './plugin'
import type { ViteSSGOptions } from '@mussi/vite-ssg'
import type { IslandsConfig } from './config'

export async function build (options: BuildOptions) {
  const start = Date.now()

  process.env.NODE_ENV = 'production'
  const config = await resolveConfig(options, 'build', 'production')

  await ssgBuild(config)

  const secondsEllapsed = (Date.now() - start) / 1000
  console.log(`build complete in ${secondsEllapsed.toFixed(2)}s.`)
}
