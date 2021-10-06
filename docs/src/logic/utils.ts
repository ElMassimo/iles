import type { RouteRecordRaw } from 'iles'
import type {
  SideBarConfig,
  MultiSideBarConfig,
  SideBarItem,
  SideBarGroup,
  SideBarLink,
} from '~/logic/config'

export const hashRE = /#.*$/
export const extRE = /(index)?\.(md|html)$/
export const endingSlashRE = /\/$/
export const outboundRE = /^[a-z]+:/i

export function isNullish(value: any): value is null | undefined {
  return value === null || value === undefined
}

export function isArray(value: any): value is any[] {
  return Array.isArray(value)
}

export function isExternal(path: string): boolean {
  return outboundRE.test(path)
}

export function isActive(currentPath: string, path?: string): boolean {
  if (path === undefined)
    return false

  const routePath = normalize(currentPath)
  const pagePath = normalize(path)

  return routePath === pagePath
}

export function normalize(path: string): string {
  return decodeURI(path).replace(hashRE, '').replace(extRE, '')
}

export function joinUrl(base: string, path: string): string {
  const baseEndsWithSlash = base.endsWith('/')
  const pathStartsWithSlash = path.startsWith('/')

  if (baseEndsWithSlash && pathStartsWithSlash)
    return base.slice(0, -1) + path

  if (!baseEndsWithSlash && !pathStartsWithSlash)
    return `${base}/${path}`

  return base + path
}

/**
 * get the path without filename (the last segment). for example, if the given
 * path is `/guide/getting-started.html`, this method will return `/guide/`.
 * Always with a trailing slash.
 */
export function getPathDirName(path: string): string {
  const segments = path.split('/')

  if (segments[segments.length - 1])
    segments.pop()

  return ensureEndingSlash(segments.join('/'))
}

export function ensureSlash(path: string): string {
  return ensureEndingSlash(ensureStartingSlash(path))
}

export function ensureStartingSlash(path: string): string {
  return /^\//.test(path) ? path : `/${path}`
}

export function ensureEndingSlash(path: string): string {
  return /(\.html|\/)$/.test(path) ? path : `${path}/`
}

/**
 * Remove `.md` or `.html` extention from the given path. It also converts
 * `index` to slush.
 */
export function removeExtension(path: string): string {
  return path.replace(/(index)?(\.(md|html))?$/, '') || '/'
}

/**
 * Sidebar
 */

export function isSideBarConfig(
  sidebar: SideBarConfig | MultiSideBarConfig,
): sidebar is SideBarConfig {
  return sidebar === false || sidebar === 'auto' || isArray(sidebar)
}

export function isSideBarGroup(
  item: SideBarItem,
): item is SideBarGroup {
  return (item as SideBarGroup).children !== undefined
}

export function isSideBarEmpty(sidebar?: SideBarConfig): boolean {
  return isArray(sidebar) ? sidebar.length === 0 : !sidebar
}

/**
 * Get the `SideBarConfig` from sidebar option. This method will ensure to get
 * correct sidebar config from `MultiSideBarConfig` with various path
 * combinations such as matching `guide/` and `/guide/`. If no matching config
 * was found, it will return `auto` as a fallback.
 */
export function getSideBarConfig(
  sidebar: SideBarConfig | MultiSideBarConfig,
  path: string,
): SideBarConfig {
  if (isSideBarConfig(sidebar))
    return sidebar

  path = ensureStartingSlash(path)

  for (const dir of Object.keys(sidebar)) {
    // make sure the multi sidebar key starts with slash too
    if (path.startsWith(ensureStartingSlash(dir)))
      return sidebar[dir]
  }

  return 'auto'
}

/**
 * Get flat sidebar links from the sidebar items. This method is useful for
 * creating the "next and prev link" feature. It will ignore any items that
 * don't have `link` property and removes `.md` or `.html` extension if a
 * link contains it.
 */
export function getFlatSideBarLinks(
  sidebar: SideBarItem[],
): SideBarLink[] {
  return sidebar.reduce<SideBarLink[]>((links, item) => {
    if (item.link)
      links.push({ text: item.text, link: removeExtension(item.link) })

    if (isSideBarGroup(item))
      links = [...links, ...getFlatSideBarLinks(item.children)]

    return links
  }, [])
}
