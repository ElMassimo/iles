<script setup lang="ts">
defineProps({
  title: { type: String, default: null },
  warn: { type: Boolean, default: false },
});
</script>

<template>
  <blockquote class="tip" :class="{ warn }">
    <div v-if="title || $slots.title" class="-mt-1 mb-2 font-semibold">
      <slot name="title">{{ title }}</slot>
    </div>
    <slot />
  </blockquote>
</template>

<style scoped>
.tip {
  overflow-x: auto;
}

.warn {
  --bg-primary: #f6c973;
  --bg-highlight: rgba(246, 201, 115, 0.2);
}
</style>
