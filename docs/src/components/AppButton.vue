<script setup lang="ts">
import { computed } from 'vue'
import type { PropType } from 'vue'

const props = defineProps({
  href: {
    type: String,
    default: '',
  },
  outline: {
    type: Boolean,
    default: false,
  },
  inline: {
    type: Boolean,
    default: false,
  },
  size: String as PropType<'sm' | 'lg'>,
})

const linkClass = computed(() => ([
  `
  inline-flex items-center justify-center
  px-3 py-2
  border border-transparent rounded-md
  hover:bg-primary
  shadow-sm
  text-base text-white font-medium
  transition duration-50
  ring-primary focus:ring-3 ring-opacity-50
  `, {
    'bg-transparent border border-primary text-primary-intense hover:text-white': props.outline,
    'bg-primary-intense': !props.outline,
    'text-sm underline': props.inline,
    'text-sm px-2.5 py-2': props.size === 'sm',
    'text-base px-3 py-2.5 md:(text-lg px-6 py-3) border-2': props.size === 'lg',
  },
]))

</script>

<template>
  <a
    :href="href"
    :class="linkClass"
  >
    <div v-if="$slots.icon" class="inline-block mr-1">
      <slot name="icon" />
    </div>
    <slot />
  </a>
</template>
