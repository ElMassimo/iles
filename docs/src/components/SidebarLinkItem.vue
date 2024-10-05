<script setup lang="ts">
import { useAppConfig } from 'iles'
import { computed, toRef } from 'vue'
import type { SideBarItem } from '~/logic/config'
import { joinUrl } from '~/logic/utils'
import { useActive } from '~/logic/sidebar'

const props = defineProps<{ item: SideBarItem, header?: boolean, table?: boolean }>()
const { item, header, table } = props

const { base } = useAppConfig()

const active = useActive(toRef(props, 'item'))
const link = computed(() => item.link && joinUrl(base, item.link))

const style = computed(() => ([
  header
    ? 'font-bold py-2'
    : table
      ? 'toc-link'
      : 'sidebar-link',
  { active: !table && active.value },
]))
</script>

<template>
  <a v-if="link" class="link transition" :href="link" :class="style">
    {{ item.text }}
  </a>
  <h5 v-else class="link transition" :class="style">
    {{ item.text }}
  </h5>
</template>

<style lang="postcss" scoped>
.link {
  @apply duration-100 inline-flex block truncate;
}

.toc-link {
  @apply items-center
    justify-between py-2 px-3 w-full rounded-md
    text-sm text-gray-700
    text-gray-500
    text-sm
    font-medium
    dark:warmgray-400
    hover:(text-primary dark:text-primary bg-$bg-highlight);
}

.sidebar-link {
  @apply relative
    items-center
    justify-between
    pl-3 py-2
    border-l border-gray-100
    dark:border-dark-400
    text-gray-500
    text-sm
    font-medium
    dark:warmgray-400
    hover:(text-primary dark:text-primary);
}

.active {
  @apply !border-primary dark:border-primary !text-primary dark:text-primary;
}
</style>
