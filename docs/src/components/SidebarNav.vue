<script setup lang="ts">
import { useSideBar } from '~/logic/sidebar'

let items = $(useSideBar())
let hasItem = $computed(() => items.length > 0)
</script>

<template>
  <nav>
    <ul v-if="hasItem" class="py-4 px-4 lg:pt-10">
      <template v-for="item of items" :key="item.text">
        <SidebarLink :item="item" :maxDepth="2"/>
      </template>
    </ul>
  </nav>
</template>
