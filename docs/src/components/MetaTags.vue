<script setup lang="ts">
import bannerSrc from "/images/banner.png";
import logoSrc from "/icons/logo.svg";
import faviconSrc from "/images/favicon.ico";

const { frontmatter, site } = usePage();

let imageUrl = $computed(() => `${site.url}${frontmatter.image || bannerSrc}`);

const isProd = import.meta.env.PROD;
</script>

<template>
  <Head>
    <meta property="author" :content="site.author" />
    <meta property="keywords" :content="site.tags.join(', ')" />
    <meta property="HandheldFriendly" content="True" />
    <meta property="MobileOptimized" content="320" />
    <meta http-equiv="cleartype" content="on" />
    <meta name="theme-color" content="#5C7E8F" />
    <meta property="og:type" content="website" />
    <meta property="og:locale" content="en_US" />
    <meta property="og:image" :content="imageUrl" />
    <meta property="twitter:image" :content="imageUrl" />
    <meta property="twitter:image:alt" content="îles" />
    <meta property="twitter:site" :content="`@${site.twitterHandle}`" />
    <meta property="twitter:creator" :content="`@${site.authorHandle}`" />
    <meta property="twitter:card" content="summary_large_image" />
    <link rel="icon" type="image/svg+xml" :href="logoSrc" />
    <link rel="shortcut icon" :href="faviconSrc" />
    <link rel="mask-icon" :href="logoSrc" color="#5C7E8F" />
    <link rel="apple-touch-icon" href="/apple-touch-icon.png" sizes="180x180" />
    <link v-if="isProd" rel="manifest" href="/pwa-manifest.json" />
  </Head>
</template>
