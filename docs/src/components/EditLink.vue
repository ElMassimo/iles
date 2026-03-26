<script setup lang="ts">
let { meta, site } = usePage();

let url = $computed(() => `${site.github}/edit/main/docs/${meta.filename}`);
</script>

<template>
  <a
    class="text-sm text-gray-600 dark:text-gray-400 hover:text-primary hidden sm:inline-block"
    :href="url"
    target="_blank"
    rel="noopener noreferrer"
  >
    <IconCarbonPen class="inline-block mr-1.5 text-xs" />Suggest changes<span
      class="hidden md:inline"
    >
      to this page</span
    >
  </a>
</template>
