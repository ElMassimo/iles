<script setup lang="ts">
import { useRoute } from 'iles'

const props = defineProps({
  href: { type: String, default: undefined },
  external: { type: Boolean, default: false },
  text: { type: String, default: '' },
})

const route = useRoute()
let attrs = $computed(() => props.external ? { rel: 'noreferrer', target: '_blank' } : {})
let isActive = $computed(() => route.path.includes(props.href))
</script>

<template>
  <a
    class="font-medium inline-flex mx-3 leading-normal border-b border-b-2 border-b-transparent"
    :href="href"
    :class="{ 'hover:border-b-primary': text, 'border-b-primary': isActive }"
    v-bind="attrs"
  >
    <slot>{{ text }}</slot>
    <OutboundLink v-if="external && text"/>
  </a>
</template>
