import fs from 'fs'
import { performance } from 'perf_hooks'
import newSpinner from 'mico-spinner'

export const warnMark = '\x1B[33m⚠\x1B[0m'

export async function withSpinner<T> (message: string, fn: () => Promise<T>) {
  const spinner = newSpinner(message).start()
  const startTime = performance.now()
  try {
    const result = await fn()
    spinner.succeed()
    console.info(`  done in ${timeSince(startTime)}\n`)
    return result
  }
  catch (e) {
    spinner.fail()
    throw e
  }
}

function timeSince (start: number): string {
  const diff = performance.now() - start
  return diff < 750 ? `${Math.round(diff)}ms` : `${(diff / 1000).toFixed(1)}s`
}

export function slash (path: string): string {
  return path.replace(/\\/g, '/')
}

export function uniq<T> (arr: Array<T>) {
  return [...new Set(arr.filter(x => x))]
}

export function flattenPath (path: string) {
  return pathToFilename(path).replace(/\//g, '_')
}

// Internal: Removes starting slash and ensures the provided extension.
// Paths ending with '/' are represented with index.html files.
export function pathToFilename (path: string, ext = '') {
  if (path.endsWith(ext)) ext = ''
  return `${(path.endsWith('/') ? `${path}index` : path).replace(/^\//g, '')}${ext}`
}

export async function replaceAsync (str: string, regex: RegExp, asyncFn: (...groups: string[]) => Promise<string>) {
  const promises = Array.from(str.matchAll(regex))
    .map(([match, ...args]) => asyncFn(match, ...args))
  const replacements = await Promise.all(promises)
  return str.replace(regex, () => replacements.shift()!)
}

export function rm (dir: string) {
  if ('rmSync' in fs)
    fs.rmSync(dir, { recursive: true, force: true })
  else
    fs.rmdirSync(dir, { recursive: true })
}
