import 'virtual:windi.css'
import 'virtual:windi-devtools'
import '~/styles/all.css'

import { defineApp } from 'iles'
import { computed } from 'vue'

import Site from '~/site'
import checkDarkTheme from '~/logic/dark-color-scheme-check?raw'

import logoSrc from '/images/logo.svg'
import faviconSrc from '/images/favicon.ico'
import bannerSrc from '/images/banner.png'

export default defineApp({
  head ({ frontmatter, route, router }) {
    console.log('routes', router.getRoutes())

    const title = computed(() => frontmatter.value.title
      ? `${frontmatter.value.title} · ${Site.title}`
      : Site.title)

    const description = computed(() =>
      frontmatter.value.description || Site.description)

    const currentUrl = computed(() => `${Site.url}${route.value.path}`)

    const imageUrl = computed(() => `${Site.url}${frontmatter.value.image || bannerSrc}`)

    return {
      title,
      meta: [
        { name: 'description', content: description },
        { property: 'author', content: Site.author },
        { property: 'keywords', content: computed(() => (frontmatter.value.tags?.split(' ') || Site.tags).join(', ')) },
        { property: 'HandheldFriendly', content: 'True' },
        { property: 'MobileOptimized', content: '320' },
        { httpEquiv: 'cleartype', content: 'on' },
        { property: 'theme-color', content: '#5C7E8F' },
        { property: 'og:type', content: 'website' },
        { property: 'og:locale', content: 'en_US' },
        { property: 'og:url', content: currentUrl },
        { property: 'og:site_name', content: Site.title },
        { property: 'og:title', content: title },
        { property: 'og:description', content: description },
        { property: 'og:image', content: imageUrl },
        { property: 'twitter:image', content: imageUrl },
        { property: 'twitter:site', content: `@${Site.twitterHandle}` },
        { property: 'twitter:card', content: 'summary_large_image' },
        { property: 'twitter:domain', content: Site.canonical },
        { property: 'twitter:title', content: title },
        { property: 'twitter:description', content: description },
        { property: 'twitter:url', content: currentUrl },
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
