import ora from 'ora'

export const okMark = '\x1B[32m✓\x1B[0m'
export const failMark = '\x1B[31m✖\x1B[0m'

export async function withSpinner<T> (message: string, fn: () => Promise<T>) {
  const spinner = ora()
  spinner.start(message)
  try {
    const result = await fn()
    spinner.stopAndPersist({ symbol: okMark })
    return result
  }
  catch (e) {
    spinner.stopAndPersist({ symbol: failMark })
    throw e
  }
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
