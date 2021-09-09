<script setup lang="ts">
defineProps({
  author: { type: String, default: null },
  href: { type: String, default: null },
})
</script>

<template>
  <div class="custom-block tip quote">
    <p>
      <slot/>
    </p>
    <p v-if="author || $slots.author" class="text-right text-sm mb-2 -mt-2 font-semibold">
      — <a :href="href" target="_blank" rel="noreferrer"><slot name="author">{{ author }}</slot></a>
    </p>
  </div>
</template>

<style scoped>
.custom-block {
  margin: 1rem 0;
  border-left: 0.5rem solid;
  padding: 0.1rem 1.5rem;
  overflow-x: auto;
}

.custom-block.tip {
  background-color: var(--bg-subtle);
  border-color: var(--color-primary);
}
</style>
