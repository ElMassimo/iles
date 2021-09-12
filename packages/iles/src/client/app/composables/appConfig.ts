import { App, InjectionKey, inject } from 'vue'
import { AppClientConfig } from '../../shared'

export const appConfigSymbol: InjectionKey<AppClientConfig> = Symbol('ilesAppClientConfig')

export function installAppConfig (app: App, config: AppClientConfig) {
  app.provide(appConfigSymbol, config)
}

export function useAppConfig (): AppClientConfig {
  const data = inject(appConfigSymbol)
  if (!data) throw new Error('App config not properly injected in app')
  return data
}
