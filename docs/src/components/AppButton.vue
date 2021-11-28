<script setup lang="ts">
defineProps({
  outline: { type: Boolean, default: false },
})
</script>

<template>
  <a class="app-button" :class="{ outline, colored: !outline }">
    <div v-if="$slots.icon" class="inline-block mr-1">
      <slot name="icon"/>
    </div>
    <slot/>
  </a>
</template>

<style lang="postcss" scoped>
.colored {
  @apply bg-primary-intense border-transparent text-white;
}

.outline {
  @apply bg-transparent border border-primary text-primary-intense hover:text-white;
}

.app-button {
  @apply inline-flex items-center justify-center
    px-3 py-2.5
    md:(text-lg px-6 py-3)
    border border-2 rounded-md
    shadow-sm
    text-base font-medium
    transition duration-50
    hover:bg-primary
    ring-primary focus:ring-3 ring-opacity-50;
}
</style>
