<script setup lang="ts">
import { withBase, useData } from 'vitepress'
const { site, theme, localePath } = useData()
</script>

<template>
  <a
    class="
      inline-flex
      items-center
      text-xl lg:text-2xl
      font-semibold
    "
    :href="localePath"
    :aria-label="`${site.title}, back to home`"
  >
    <img
      v-if="theme.logo"
      class="
        inline-flex
        mr-1 lg:mr-3
        h-8 lg:h-10
      "
      :src="withBase(theme.logo)"
      alt="Logo"
    >
    {{ site.title }}
  </a>
</template>
