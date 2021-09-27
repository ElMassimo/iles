import { computed, ref } from 'vue'
import { usePage } from 'iles'
import { getSideBarConfig } from './utils'
import type { Header, SideBarItem } from '~/logic/config'
import site from '~/site'

export const openSideBar = ref(false)

export const toggleSidebar = (to?: boolean) => {
  openSideBar.value = typeof to === 'boolean' ? to : !openSideBar.value
}

export function useSideBar() {
  let { route, frontmatter, page } = $(usePage())

  return computed(() => {
    // at first, we'll check if we can find the sidebar setting in frontmatter.
    const { headers } = page
    const sidebar = frontmatter.sidebar ?? (site.sidebar && getSideBarConfig(
      site.sidebar,
      route.path,
    ))
    const sidebarDepth = frontmatter.sidebarDepth

    // if it's `false`, we'll just return an empty array here.
    if (sidebar === false)
      return []

    // if it's `auto`, render headers of the current page
    if (sidebar === 'auto')
      return resolveAutoSidebar(headers, sidebarDepth)

    return sidebar
  })
}

function resolveAutoSidebar(
  headers: Header[],
  depth: number,
): SideBarItem[] {
  const ret: SideBarItem[] = []

  if (headers === undefined)
    return []

  let lastH2: SideBarItem | undefined
  headers.forEach(({ level, title, slug }) => {
    if (level - 1 > depth)
      return

    const item: SideBarItem = {
      text: title,
      link: `#${slug}`,
    }
    if (level === 2) {
      lastH2 = item
      ret.push(item)
    } else if (lastH2) {
      ((lastH2 as any).children || ((lastH2 as any).children = [])).push(item)
    }
  })

  return ret
}
