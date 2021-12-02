// Use vue-router navigation during development even when using anchor tags.

import { useRouter } from 'vue-router'
import { inBrowser } from '../utils'

export function useRouterLinks () {
  if (!inBrowser) return

  const router = useRouter()

  window.addEventListener(
    'click',
    (e) => {
      if (e.defaultPrevented) return
      const link = (e.target as Element).closest('a')
      if (link) {
        const { protocol, hostname, pathname, hash, target } = link
        const currentUrl = window.location
        const extMatch = pathname.match(/\.\w+$/)
        // only intercept inbound links
        if (
          !e.ctrlKey
          && !e.shiftKey
          && !e.altKey
          && !e.metaKey
          && target !== '_blank'
          && protocol === currentUrl.protocol
          && hostname === currentUrl.hostname
          && !(extMatch && extMatch[0] !== '.html')
          && router.resolve({ path: pathname })?.name !== 'NotFound'
        ) {
          if (pathname !== currentUrl.pathname || !hash) e.preventDefault()
          if (pathname !== currentUrl.pathname) router.push({ path: pathname, hash })
        }
      }
    },
    { capture: true },
  )
}
