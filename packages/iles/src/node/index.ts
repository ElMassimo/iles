export { default, ILES_APP_ENTRY } from './plugin/plugin'
export { build } from './build/build'
export { resolveConfig } from './config'
import { UserConfig } from '../../types/shared'

export function defineConfig (config: UserConfig) {
  return config
}
