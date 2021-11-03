<script setup lang="ts">
defineProps({
  caption: { type: String, required: true },
  src: { type: String, required: true },
  narrow: { type: Boolean, default: false },
  wide: { type: Boolean, default: false },
})
</script>

<template>
  <img class="img" :class="{ narrow, wide }" :src="src" :alt="caption">
  <Caption>{{ caption }}</Caption>
</template>
