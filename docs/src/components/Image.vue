<script setup lang="ts">
defineProps({
  alt: { type: String, required: true },
  src: { type: String, required: true },
  narrow: { type: Boolean, default: true },
  wide: { type: Boolean, default: false },
});
</script>

<template>
  <img class="img mx-auto" :class="{ narrow, wide }" :src="src" :alt="alt" />
  <Caption>{{ alt }}</Caption>
</template>
