<script setup lang="ts">
import { computed } from 'vue'
import { getLayout } from '@islands/layouts'

const props = withDefaults(defineProps<{ name?: string | false }>(), { name: 'default' })

const LayoutComponent = computed(() => getLayout(props.name))
</script>

<script lang="ts">
export default {
  name: 'Layout',
}
</script>

<template>
  <component v-if="LayoutComponent" :is="LayoutComponent">
    <slot/>
  </component>
  <slot v-else/>
</template>
