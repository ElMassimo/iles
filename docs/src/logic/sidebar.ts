import { computed, ref } from 'vue'
import { useRoute } from 'iles'
import { getSideBarConfig } from './utils'
import type { Header, SideBarItem } from '~/logic/config'
import site from '~/site'

export const openSideBar = ref(false)

export const toggleSidebar = (to?: boolean) => {
  openSideBar.value = typeof to === 'boolean' ? to : !openSideBar.value
}

export function useSideBar() {
  const route = useRoute()

  return computed(() => {
    console.log('useSideBar', route.matched?.[0]?.components)
    // at first, we'll check if we can find the sidebar setting in frontmatter.
    const headers: any[] = []
    const frontSidebar = route.meta.frontmatter.sidebar
    const sidebarDepth = route.meta.frontmatter.sidebarDepth

    // if it's `false`, we'll just return an empty array here.
    if (frontSidebar === false)
      return []

    // if it's `auto`, render headers of the current page
    if (frontSidebar === 'auto')
      return resolveAutoSidebar(headers, sidebarDepth)

    // now, there's no sidebar setting at frontmatter; let's see the configs
    const themeSidebar = getSideBarConfig(
      site.sidebar,
      route.meta.frontmatter.filename,
    )

    if (themeSidebar === false)
      return []

    if (themeSidebar === 'auto')
      return resolveAutoSidebar(headers, sidebarDepth)

    return themeSidebar
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
