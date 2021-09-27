<script setup lang="ts">
import { usePage } from 'iles'

let { frontmatter } = $(usePage())

let hasLastUpdated = $computed(() => Boolean(frontmatter.lastUpdated))

// TODO: Use client:idle and RelativeTime component.
let datetime = $computed(() => new Date(frontmatter.lastUpdated).toLocaleString('en-US'))
</script>

<template>
  <p v-if="hasLastUpdated" class="inline-block">
    <span class="inline-block font-medium">Last Updated:</span>
    <span class="inline-block ml-1.5 font-normal">{{ datetime }}</span>
  </p>
</template>
