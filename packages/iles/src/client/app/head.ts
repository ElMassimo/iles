import { computed } from 'vue'
import type { AppContext, HeadConfig } from '../shared'

function notEmpty<T>(val: T | boolean | undefined | null): val is T {
  return Boolean(val)
}

export function defaultHead({ frontmatter, meta, route, config, site }: AppContext, includeSocialTags: boolean | undefined): HeadConfig {
  const title = computed(() => {
    const title = frontmatter.title ?? meta.title
    return title ? `${title} · ${site.title}` : site.title
  })

  const description = computed(() =>
    frontmatter.description || site.description)

  const currentUrl = computed(() => `${site.url}${route.path}`)

  const metaTags: HeadConfig['meta'] = [
    { charset: 'UTF-8' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1.0' },
    { name: 'description', content: description },
  ]

  if (includeSocialTags !== false) {
    metaTags.push(
      { property: 'og:url', content: currentUrl },
      { property: 'og:site_name', content: site.title },
      { property: 'og:title', content: title },
      { property: 'og:description', content: description },
      { property: 'twitter:domain', content: site.canonical },
      { property: 'twitter:title', content: title },
      { property: 'twitter:description', content: description },
      { property: 'twitter:url', content: currentUrl },
    )
  }

  return {
    title,
    meta: metaTags,
    link: [
      config.sitemap && { rel: 'sitemap', href: `${site.url}/sitemap.xml` },
    ].filter(notEmpty),
    htmlAttrs: { lang: 'en-US' },
  }
}
