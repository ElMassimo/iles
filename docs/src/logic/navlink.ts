export const EXTERNAL_URL_RE = /^https?:/i

export const outboundRE = /^[a-z]+:/i

export function isExternal (path: string): boolean {
  return outboundRE.test(path)
}

/**
 * Join two paths by resolving the slash collision.
 */
export function joinPath (base: string, path: string): string {
  return `${base}${path}`.replace(/\/+/g, '/')
}
