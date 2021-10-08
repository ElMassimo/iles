import 'virtual:windi.css'
import 'virtual:windi-devtools'
import '~/styles/all.css'

import { defineApp } from 'iles'
import { computed } from 'vue'

import checkDarkTheme from '~/logic/dark-color-scheme-check?raw'

import logoSrc from '/images/logo.svg'
import faviconSrc from '/images/favicon.ico'
import bannerSrc from '/images/banner.png'

export default defineApp({
  head ({ frontmatter, site }) {
    const imageUrl = computed(() => `${site.url}${frontmatter.image || bannerSrc}`)

    return {
      meta: [
        { property: 'author', content: site.author },
        { property: 'keywords', content: computed(() => (frontmatter.tags?.split(' ') || site.tags).join(', ')) },
        { property: 'HandheldFriendly', content: 'True' },
        { property: 'MobileOptimized', content: '320' },
        { httpEquiv: 'cleartype', content: 'on' },
        { property: 'theme-color', content: '#5C7E8F' },
        { property: 'og:type', content: 'website' },
        { property: 'og:locale', content: 'en_US' },
        { property: 'og:image', content: imageUrl },
        { property: 'twitter:image', content: imageUrl },
        { property: 'twitter:site', content: `@${site.twitterHandle}` },
        { property: 'twitter:card', content: 'summary_large_image' },
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: logoSrc },
        { rel: 'shortcut icon', href: faviconSrc },
      ],
      script: [
        { children: checkDarkTheme },
        import.meta.env.PROD && { src: 'https://unpkg.com/thesemetrics@latest', async: true },
      ].filter(notEmpty),
    }
  },
})

function notEmpty<T> (val: T | boolean | undefined | null): val is T {
  return Boolean(val)
}
