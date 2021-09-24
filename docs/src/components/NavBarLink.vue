<script setup lang="ts">
const props = defineProps({
  external: { type: Boolean, default: false },
  text: { type: String, default: '' },
})

const attrs = props.external ? { rel: 'noreferrer', target: '_blank' } : {}
</script>

<template>
  <a
    class="font-medium hidden lg:inline-flex mx-3 leading-normal border-b border-b-2 border-b-transparent"
    :class="{ 'hover:border-b-primary': text }"
    v-bind="attrs"
  >
    <slot>{{ text }}</slot>
    <OutboundLink v-if="external && text"/>
  </a>
</template>
