export { default } from './plugin/plugin'
export { ILES_APP_ENTRY } from './plugin/middleware'
export { build } from './build/build'
export { resolveConfig } from './config'
import { UserConfig } from '../../types/shared'

export function defineConfig (config: UserConfig) {
  return config
}
