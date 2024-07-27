<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
  href: { type: String, default: undefined },
  external: { type: Boolean, default: false },
  text: { type: String, default: '' },
})

const route = useRoute()
let attrs = computed(() => props.external ? { rel: 'noreferrer', target: '_blank' } : {})
let isActive = computed(() => props.href && route.path.includes(props.href))
</script>

<template>
  <component
    :is="href ? 'a' : 'button'"
    :href="href"
    class="font-medium text-sm inline-flex mx-3 leading-normal border-b border-b-2 border-b-transparent"
    :class="{ 'hover:border-b-primary': text, 'border-b-primary': isActive }"
    v-bind="attrs"
  >
    <slot>{{ text }}</slot>
    <OutboundLink v-if="external && text"/>
  </component>
</template>
