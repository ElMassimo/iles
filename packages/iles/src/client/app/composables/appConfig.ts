import { inject } from 'vue'

import type { App, InjectionKey } from 'vue'
import type { AppClientConfig } from '../../shared'

export const appConfigSymbol: InjectionKey<AppClientConfig> = Symbol('[iles-app-config]')

export function installAppConfig(app: App, config: AppClientConfig) {
  app.provide(appConfigSymbol, config)
}

export function useAppConfig(): AppClientConfig {
  const data = inject(appConfigSymbol)
  if (!data) { throw new Error('App config not properly injected in app') }
  return data
}
