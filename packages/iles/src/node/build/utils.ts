import newSpinner from 'mico-spinner'

export const warnMark = '\x1B[33m⚠\x1B[0m'

export async function withSpinner<T> (message: string, fn: () => Promise<T>) {
  const spinner = newSpinner(message).start()
  const startTime = performance.now()
  try {
    const result = await fn()
    spinner.succeed()
    console.log(`  done in ${timeSince(startTime)}\n`)
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

// page filename conversion
// foo/bar.md -> foo_bar.md
export function fileToAssetName (path: string): string {
  return slash(path).replace(/\//g, '_')
}

export function uniq<T> (arr: Array<T>) {
  return [...new Set(arr.filter(x => x))]
}

export function pathToFilename (path: string, ext: string) {
  if (path.endsWith(ext)) ext = ''
  return `${(path.endsWith('/') ? `${path}index` : path).replace(/^\//g, '')}${ext}`
}

export async function replaceAsync (str: string, regex: RegExp, asyncFn: (...groups: string[]) => Promise<string>) {
  const promises = Array.from(str.matchAll(regex))
    .map(([match, ...args]) => asyncFn(match, ...args))
  const replacements = await Promise.all(promises)
  return str.replace(regex, () => replacements.shift()!)
}
