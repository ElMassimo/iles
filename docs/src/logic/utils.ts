const hashRE = /#.*$/
const extRE = /(index)?\.(md|html)$/
const endingSlashRE = /\/$/

/**
 * Remove `.md` or `.html` extention from the given path. It also converts
 * `index` to slush.
 */
export function normalize (path: string): string {
  return decodeURI(path).replace(hashRE, '').replace(extRE, '').replace(endingSlashRE, '')
}

export function isArray <T> (value: any): value is T[] {
  return Array.isArray(value)
}

export function isActive (currentPath: string, path?: string): boolean {
  if (path === undefined)
    return false

  const routePath = normalize(currentPath)
  const pagePath = normalize(path)

  return routePath === pagePath
}

export function joinUrl (base: string, path: string): string {
  if (path.startsWith('#')) return path
  return `${base}${path.startsWith('/') ? path.slice(1) : path}`
}

export function ensureStartingSlash (path: string): string {
  return /^\//.test(path) ? path : `/${path}`
}
