<script setup lang="ts">
const { src } = defineProps<{ src: string | any[] }>()

const allSources = $computed(() => Array.isArray(src) ? src : [{ srcset: src, src }])
const sources = $computed(() => allSources.slice(0, -1))
const lastSource = $computed(() => allSources[allSources.length - 1])
</script>

<script lang="ts">
export default {
  inheritAttrs: false
}
</script>

<template>
  <picture>
    <source v-for="(attrs, index) in sources" :key="index" v-bind="attrs">
    <img v-bind="{ ...lastSource, ...$attrs }">
  </picture>
</template>
