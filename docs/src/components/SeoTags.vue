<script setup lang="ts">
import { usePage } from 'iles'

import logoSrc from '/images/logo.svg'
import faviconSrc from '/images/favicon.ico'
import bannerSrc from '/images/banner.png'

const { frontmatter, site } = usePage()

let keywords = $computed(() => (frontmatter.tags?.split(' ') || site.tags).join(', '))
let imageUrl = $computed(() => `${site.url}${frontmatter.image || bannerSrc}`)
</script>

<template>
  <Head>
    <meta property="author" :content="site.author">
    <meta property="keywords" :content="keywords">
    <meta property="HandheldFriendly" content="True">
    <meta property="MobileOptimized" content="320">
    <meta httpEquiv="cleartype" content="on">
    <meta property="theme-color" content="#5C7E8F">
    <meta property="og:type" content="website">
    <meta property="og:locale" content="en_US">
    <meta property="og:image" :content="imageUrl">
    <meta property="twitter:image" :content="imageUrl">
    <meta property="twitter:site" :content="`@${site.twitterHandle}`">
    <meta property="twitter:card" content="summary_large_image">
    <link rel="icon" type="image/svg+xml" :href="logoSrc">
    <link rel="shortcut icon" :href="faviconSrc">
  </Head>
</template>
