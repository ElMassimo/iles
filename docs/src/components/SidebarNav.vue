<script setup lang="ts">
import { computed } from 'vue'
import { useSideBar } from '~/logic/sidebar'

const items = useSideBar()
const hasItem = computed(() => items.value.length > 0)
</script>

<template>
  <nav>
    <ul v-if="hasItem" class="py-4 px-4 lg:pt-10">
      <template v-for="item of items" :key="item.text">
        <SidebarLink :item="item" :max-depth="2"/>
      </template>
    </ul>
  </nav>
</template>
