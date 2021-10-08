import { App, InjectionKey } from 'vue'

type ClientScripts = Record<string, any>

export const clientScriptsSymbol: InjectionKey<ClientScripts> = Symbol('[iles-client-scripts]')

export function useClientScripts (app: App): ClientScripts {
  return app._context.provides[clientScriptsSymbol as any] ||= {}
}
