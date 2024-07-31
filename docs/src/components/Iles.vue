<script setup lang="ts">
const props = defineProps({
  heading: { type: Boolean, default: false },
  small: { type: Boolean, default: false },
  noText: { type: Boolean, default: false },
})
const marginTop = props.heading ? '-mt-3 mx-1' : props.small ? '-mt-2.3 mx-0.5' : '-mt-4.8'
const size = props.small ? 'h-6' : 'h-10'
</script>

<template>
  <a :href="$site.github" target="_blank" rel="noreferrer">
    <IconAppText v-if="!noText" class="inline-block text-intense hover:text-primary-soft fill-current stroke-current stroke-2" :class="[marginTop, size]" />
    <slot><IconAppLogo v-if="heading" class="inline-block -mt-2" /></slot>
  </a>
</template>
