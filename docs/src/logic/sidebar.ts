import { computed, ref } from 'vue'
import { usePage } from 'iles'
import type { Header } from '@islands/headers'

import { getSideBarConfig } from './utils'
import type { SideBarItem } from '~/logic/config'

export const openSideBar = ref(false)

export const toggleSidebar = (to?: boolean) => {
  openSideBar.value = typeof to === 'boolean' ? to : !openSideBar.value
}

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

    // if it's `auto`, render headers of the current page
    if (sidebar === 'auto')
      return resolveAutoSidebar(meta.headers, frontmatter.sidebarLevel || 1, frontmatter.sidebarDepth || 1)

    return sidebar
  })
}

function resolveAutoSidebar (headers: undefined | Header[], topLevel: number, depth: number): SideBarItem[] {
  if (headers === undefined) return []

  const ret: SideBarItem[] = []
  let lastTopHeading: SideBarItem | undefined
  headers.forEach(({ level, title, slug }) => {
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
