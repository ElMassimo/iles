<script setup lang="ts">
defineProps({
  caption: { type: String, required: true },
  src: { type: String, required: true },
  narrow: { type: Boolean, defalt: false },
  wide: { type: Boolean, defalt: false },
})
</script>

<template>
  <img class="img" :class="{ narrow, wide }" :src="src" :alt="caption">
  <span class="caption" v-text="caption"/>
</template>
