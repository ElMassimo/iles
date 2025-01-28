<script setup lang="ts">
import bannerSrc from '/images/banner.png'
import logoSrc from '/icons/logo.svg'
import faviconSrc from '/images/favicon.ico'

const { frontmatter, site } = usePage()

let imageUrl = $computed(() => `${site.url}${frontmatter.image || bannerSrc}`)

const isProd = import.meta.env.PROD

const author = frontmatter.author || site.author
const keywords = (frontmatter.tags || site.tags)?.join(', ')

// Manage head meta with useSeoMeta
useSeoMeta({
  author,
  keywords,

  // Open Graph / Facebook / LinkedIn / Discord
  ogType: 'website',
  ogImage: imageUrl,
  ogImageAlt: 'Îles',
  ogLocale: 'en_US',

  // Twitter (X)
  twitterCard: 'summary_large_image',
  twitterImage: imageUrl,
  twitterImageAlt: 'Îles',
  twitterSite: site.twitterHandle,
  twitterCreator: site.authorHandle,
})
</script>

<template>
  <Head>
    <meta property="HandheldFriendly" content="True">
    <meta property="MobileOptimized" content="320">
    <meta http-equiv="cleartype" content="on">
    <meta name="theme-color" content="#5C7E8F">
    <link rel="icon" type="image/svg+xml" :href="logoSrc">
    <link rel="shortcut icon" :href="faviconSrc">
    <link rel="mask-icon" :href="logoSrc" color="#5C7E8F">
    <link rel="apple-touch-icon" href="/apple-touch-icon.png" sizes="180x180">
    <link v-if="isProd" rel="manifest" href="/pwa-manifest.json">
  </Head>
</template>
