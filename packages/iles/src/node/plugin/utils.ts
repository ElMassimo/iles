import { promises as fs, constants as fsConstants } from 'fs'
export { default as serialize } from '@nuxt/devalue'

import newSpinner from 'mico-spinner'
import { isPackageExists, importModule } from 'local-pkg'
import { installPackage } from '@antfu/install-pkg'

export function sleep (ms: number) {
  return new Promise<void>((resolve) => { setTimeout(resolve, ms) })
}

export async function resolvePlugin<T> (name: string) {
  if (!isPackageExists(name)) {
    await withSpinner(`Installing ${name}...`, async () =>
      await installPackage(name, { dev: true, preferOffline: true }))
  }
  return await importModule(name)
}

async function withSpinner<T> (message: string, fn: () => Promise<T>) {
  const spinner = newSpinner(message).start()
  try {
    const result = await fn()
    spinner.succeed()
    return result
  }
  catch (e) {
    spinner.fail()
    throw e
  }
}

export function isString (val: any): val is string {
  return typeof val === 'string'
}

export function uniq<T> (arr: Array<T>) {
  return [...new Set(arr.filter(x => x))]
}

export function escapeRegex (str: string) {
  return str.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')
}

export function pascalCase (str: string) {
  return capitalize(camelCase(str))
}

export function camelCase (str: string) {
  return str.replace(/[^\w_]+(\w)/g, (_, c) => c ? c.toUpperCase() : '')
}

export function uncapitalize (str: string) {
  return str.charAt(0).toLowerCase() + str.slice(1)
}

export function capitalize (str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export async function replaceAsync (str: string, regex: RegExp, asyncFn: (...groups: string[]) => Promise<string>) {
  const promises = Array.from(str.matchAll(regex))
    .map(([match, ...args]) => asyncFn(match, ...args))
  const replacements = await Promise.all(promises)
  return str.replace(regex, () => replacements.shift()!)
}

export async function exists (filePath: string) {
  return await fs.access(filePath, fsConstants.F_OK).then(() => true, () => false)
}
