<script setup lang="ts">
import { computed } from 'vue'
import type { SideBarGroup } from '~/logic/config'

const { item } = defineProps<{ item: SideBarGroup }>()

let children = computed(() => item.children)
</script>

<template>
  <li>
    <SidebarLinkItem :item="item" :header="true"/>
    <ul v-if="children" class="mb-2">
      <li v-for="child in children" :key="child.text">
        <SidebarLinkItem :item="child"/>
      </li>
    </ul>
  </li>
</template>
