import { promises as fs, constants as fsConstants } from 'fs'
import { createRequire } from 'module'
import createDebugger from 'debug'
import { dirname } from 'pathe'
import newSpinner from 'mico-spinner'
import { installPackage } from '@antfu/install-pkg'
import { importModule } from '../modules'
const require = createRequire(import.meta.url)

export { default as serialize } from '@nuxt/devalue'

export const debug = {
  config: createDebugger('iles:config'),
  documents: createDebugger('iles:documents'),
  mdx: createDebugger('iles:mdx'),
  layout: createDebugger('iles:layout'),
  detect: createDebugger('iles:detect'),
  resolve: createDebugger('iles:resolve'),
  build: createDebugger('iles:build'),
}

export function sleep (ms: number) {
  return new Promise<void>((resolve) => { setTimeout(resolve, ms) })
}

export async function tryInstallModule (name: string) {
  try {
    return require.resolve(name)
  }
  catch (error) {
    if (error.code !== 'MODULE_NOT_FOUND')
      throw error

    console.info(`\n${name} not found. Proceeding to auto-install.\n`)

    await withSpinner(`Installing ${name}`, async () =>
      await installPackage(name, { dev: true, preferOffline: true, silent: true }))

    return dirname(require.resolve(`${name}/package.json`))
  }
}

export async function importLibrary<T> (pkgName: string) {
  try {
    const pkgPath = await tryInstallModule(pkgName)
    return await importModule(pkgPath)
  } catch (error) {
    return await importModule(pkgName)
  }
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

export function isStringPlugin (val: any): val is [string, any] {
  return Array.isArray(val) && isString(val[0])
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

export function compact<T> (val: (false | undefined | null | T)[]): T[] {
  return val.filter(x => x) as T[]
}
