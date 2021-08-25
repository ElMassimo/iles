<script setup lang="ts">
import { useHead } from '@vueuse/head'

const title = 'Vitesse SSR'
const description = 'Opinionated SSR Vite Starter Template'

// https://github.com/vueuse/head
// you can use this to manipulate the document head in any components,
// they will be rendered correctly in the html results with vite-ssg
useHead({
  title,
  meta: [
    { name: 'description', content: description },
    { name: 'description', content: description },
    { property: 'og:title', content: title },
    {
      property: 'og:image',
      content:
        'https://repository-images.githubusercontent.com/341177866/d42c1300-7633-11eb-84fd-ec68894d4fc9',
    },
  ],
})
</script>

<template>
  <router-view />
</template>
