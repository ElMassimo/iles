import { computed } from 'vue'
import { useRoute } from 'iles'
import type { Ref } from 'vue'
import appConfig from '@islands/app-config'

export const EXTERNAL_URL_RE = /^https?:/i

export interface NavItemBase {
  text: string
  target?: string
  rel?: string
  ariaLabel?: string
  activeMatch?: string
}

export interface NavItemWithLink extends NavItemBase {
  link: string
}

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

export function withBase (path: string) {
  return EXTERNAL_URL_RE.test(path)
    ? path
    : joinPath(appConfig.base, path)
}

export function useNavLink (item: Ref<NavItemWithLink>, isDropdown = false) {
  const route = useRoute()

  const external = isExternal(item.value.link)

  const props = computed(() => {
    const routePath = normalizePath(`/${route}`)

    let active = false
    if (item.value.activeMatch) {
      active = new RegExp(item.value.activeMatch).test(routePath)
    }
    else {
      const itemPath = normalizePath(withBase(item.value.link))
      active = itemPath === routePath
    }

    return {
      class: {
        'bg-$windi-hover-bg': active && isDropdown,
        'text-primary': active && !isDropdown,
      },
      href: external ? item.value.link : withBase(item.value.link),
      target: item.value.target || external ? '_blank' : undefined,
      rel: item.value.rel || external ? 'noopener noreferrer' : undefined,
      'aria-label': item.value.ariaLabel,
    }
  })

  return {
    props,
    isExternal,
  }
}

function normalizePath (path: string): string {
  return path
    .replace(/#.*$/, '')
    .replace(/\?.*$/, '')
    .replace(/\.(html|md)$/, '')
    .replace(/\/index$/, '/')
}
