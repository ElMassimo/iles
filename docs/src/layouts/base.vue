<script client:load lang="ts">
import { registerSW } from 'virtual:pwa-register'

if (import.meta.env.PROD)
  console.log('Powered by îles 🏝', 'https://iles-docs.netlify.app')

registerSW({ immediate: true })
</script>

<template>
  <MetaTags/>
  <TheNavBar/>
  <slot/>
</template>
