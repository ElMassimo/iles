<script client:load lang="ts">
import '~/logic/quicklink'

if (import.meta.env.PROD)
  console.log('Powered by îles 🏝', 'https://iles-docs.netlify.app')
</script>

<template>
  <SeoTags/>
  <TheNavBar/>
  <slot/>
</template>
