import { RouteRecordRaw } from 'vue-router'

export const okMark = '\x1B[32m✓\x1B[0m'
export const failMark = '\x1B[31m✖\x1B[0m'

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

export interface SSGRoute {
  path: string
  filename: string | undefined
  extension: string
  outputFilename: string
  content: string | undefined
}

function pathToFilename (path: string, ext: string) {
  return `${(path.endsWith('/') ? `${path}index` : path).replace(/^\//g, '')}.${ext}`
}

export function routesToPaths (routes: RouteRecordRaw[]) {
  const paths: Set<SSGRoute> = new Set()
  console.log({ routes })

  const getPaths = (routes: RouteRecordRaw[], prefix = '') => {
    // remove trailing slash
    prefix = prefix.replace(/\/$/g, '')
    for (const route of routes) {
      let path = route.path
      // check for leading slash
      if (route.path) {
        path = prefix && !route.path.startsWith('/')
          ? `${prefix}/${route.path}`
          : route.path

        const filename = route.meta?.filename as any

        const extension = route.meta?.extension || 'html'

        paths.add({
          path,
          filename,
          extension,
          outputFilename: pathToFilename(path, extension),
        })
      }
      if (Array.isArray(route.children))
        getPaths(route.children, path)
    }
  }

  getPaths(routes)
  return [...paths]
}

export async function replaceAsync (str: string, regex: RegExp, asyncFn: (...groups: string[]) => Promise<string>) {
  const promises = Array.from(str.matchAll(regex))
    .map(([match, ...args]) => asyncFn(match, ...args))
  const replacements = await Promise.all(promises)
  return str.replace(regex, () => replacements.shift()!)
}
