import type { Pluggable } from 'unified'
import type { PluginLike, PluginOption } from './types'

// Resolve plugins that might need an async import in CJS.
export async function resolvePlugins(plugins: PluginOption[]) {
  return compact<Pluggable>(await Promise.all(plugins.map(resolvePlugin)))
}

async function resolvePlugin(plugin: PluginOption): Promise<PluginLike> {
  if (isString(plugin)) { return await importPlugin(plugin) }
  if (!plugin) { return plugin }
  if (isStringPlugin(plugin)) { return await importPlugin(...plugin) }
  return plugin
}

async function importPlugin(pkgName: string, ...options: any[]): Promise<Pluggable> {
  return [await import(pkgName).then(unwrapModule), ...options]
}

function unwrapModule(mod: any): any {
  return mod && mod.default ? unwrapModule(mod.default) : mod
}

export function isString(val: any): val is string {
  return typeof val === 'string'
}

export function isStringPlugin(val: any): val is [string, any] {
  return Array.isArray(val) && isString(val[0])
}

export function compact<T>(val: (false | undefined | null | T)[]): T[] {
  return val.filter(x => x) as T[]
}
