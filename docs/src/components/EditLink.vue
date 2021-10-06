<script setup lang="ts">
import { usePage } from 'iles'

let { meta, site } = $(usePage())

let url = $computed(() => `${site.github}/edit/main/docs/${meta.filename}`)
</script>

<template>
  <div>
    <a
      class="text-sm text-gray-600 dark:text-gray-400 hover:text-primary"
      :href="url"
      target="_blank"
      rel="noopener noreferrer"
    >
      <carbon:pen class="inline-block mr-1.5 text-xs"/>Suggest changes to this page
    </a>
  </div>
</template>
