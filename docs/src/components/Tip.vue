<script setup lang="ts">
defineProps({
  title: { type: String, default: null },
  warn: { type: Boolean, default: false },
})
</script>

<template>
  <blockquote class="overflow-x-auto" :class="{ warn }">
    <div v-if="title || $slots.title" class="-mt-1 mb-2 font-semibold">
      <slot name="title">{{ title }}</slot>
    </div>
    <slot/>
  </blockquote>
</template>
