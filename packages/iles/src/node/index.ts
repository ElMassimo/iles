export { default } from './plugin/plugin'
export { ILES_APP_ENTRY } from './constants'
export { build } from './build/build'
export { resolveConfig } from './config'
export { mergeConfig } from 'vite'
import type { UserConfig } from '../../types/shared'

export function defineConfig(config: UserConfig) {
  return config
}
