import type { UserConfig } from './shared'

import Plugin from './plugin/index'

export default Plugin
export * from './build/build'
export * from './config'

export function defineConfig (config: UserConfig) {
  return config
}
