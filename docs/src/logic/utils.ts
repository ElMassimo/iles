const hashRE = /#.*$/
const extRE = /(index)?\.(md|html)$/
const endingSlashRE = /\/$/

/**
 * Remove `.md` or `.html` extention from the given path. It also converts
 * `index` to slush.
 */
export function normalize(path: string): string {
  return ensureStartingSlash(decodeURI(path).replace(hashRE, '').replace(extRE, '').replace(endingSlashRE, ''))
}

function ensureStartingSlash(path: string): string {
  return path.startsWith('/') ? path : `/${path}`
}

export function joinUrl(base: string, path: string): string {
  if (path.startsWith('#')) { return path }
  return `${base}${path.startsWith('/') ? path.slice(1) : path}`
}
