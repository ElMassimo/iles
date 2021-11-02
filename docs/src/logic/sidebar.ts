import { computed } from 'vue'
import { usePage } from 'iles'

import type { Heading } from '@islands/headings'
import type {
  SideBarConfig,
  MultiSideBarConfig,
  SideBarItem,
  SideBarGroup,
  SideBarLink,
} from '~/logic/config'

import { ensureStartingSlash, normalize, isArray } from '~/logic/utils'

export function useSideBar () {
  let { route, frontmatter, meta, site } = usePage()

  return computed(() => {
    // at first, we'll check if we can find the sidebar setting in frontmatter.
    const sidebar = frontmatter.sidebar ?? (site.sidebar && getSideBarConfig(
      site.sidebar,
      route.path,
    ))

    // if it's `false`, we'll just return an empty array here.
    if (sidebar === false)
      return []

    // if it's `auto`, render heading of the current page
    if (sidebar === 'auto')
      return resolveAutoSidebar(meta.headings, frontmatter.sidebarLevel || 1, frontmatter.sidebarDepth || 1)

    return sidebar
  })
}

function resolveAutoSidebar (heading: undefined | Heading[], topLevel: number, depth: number): SideBarItem[] {
  if (heading === undefined) return []

  const ret: SideBarItem[] = []
  let lastTopHeading: SideBarItem | undefined
  heading.forEach(({ level, title, slug }) => {
    if (level - 1 > depth)
      return

    const item: SideBarItem = {
      text: title,
      link: `#${slug}`,
    }

    if (level === topLevel) {
      lastTopHeading = item
      ret.push(item)
    }
    else if (lastTopHeading) {
      ((lastTopHeading as any).children || ((lastTopHeading as any).children = [])).push(item)
    }
  })

  return ret
}

/**
 * Utils
 */
function isSideBarConfig (
  sidebar: SideBarConfig | MultiSideBarConfig,
): sidebar is SideBarConfig {
  return sidebar === false || sidebar === 'auto' || isArray(sidebar)
}

export function isSideBarGroup (
  item: SideBarItem,
): item is SideBarGroup {
  return (item as SideBarGroup).children !== undefined
}

/**
 * Get the `SideBarConfig` from sidebar option. This method will ensure to get
 * correct sidebar config from `MultiSideBarConfig` with various path
 * combinations such as matching `guide/` and `/guide/`. If no matching config
 * was found, it will return `auto` as a fallback.
 */
export function getSideBarConfig (
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
export function getSideBarLinks (sidebar: SideBarConfig | MultiSideBarConfig, path: string) {
  const sidebarItems = getSideBarConfig(sidebar, path)
  const links: SideBarLink[] = []
  if (!isArray(sidebarItems)) return links

  const addLinks = (item: SideBarItem) => {
    if (item.link) links.push({ text: item.text, link: normalize(item.link) })
    if (isSideBarGroup(item)) item.children.forEach(addLinks)
  }
  sidebarItems.forEach?.(addLinks)
  return links
}
