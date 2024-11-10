<script setup lang="ts">
const { href, external } = defineProps({
  href: { type: String, default: undefined },
  external: { type: Boolean, default: false },
  text: { type: String, default: '' },
})

const route = useRoute()
let attrs = $computed(() => external ? { rel: 'noreferrer', target: '_blank' } : {})
let isActive = $computed(() => href && route.path.includes(href))
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
