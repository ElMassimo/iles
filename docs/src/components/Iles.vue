<script setup lang="ts">
const props = defineProps({ heading: { type: Boolean, default: false } })
const marginTop = props.heading ? '-mt-3 mx-1' : '-mt-4.8'
</script>

<template>
  <a :href="$site.github" target="_blank" rel="noreferrer" aria-label="îles">
    <iles:Text class="inline-block text-intense hover:text-primary-soft fill-current stroke-current stroke-2 h-10" :class="marginTop"/>
    <slot/>
  </a>
</template>
