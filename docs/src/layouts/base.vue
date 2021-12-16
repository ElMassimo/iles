<script client:load lang="ts">
if (import.meta.env.PROD)
  console.log('Powered by îles 🏝', 'https://iles-docs.netlify.app')
</script>

<template>
  <SeoTags/>
  <TheNavBar/>
  <slot/>
</template>
