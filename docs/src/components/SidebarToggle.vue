<script setup lang="ts">
import { openSideBar } from '~/logic/sidebar'
</script>

<template>
  <NavBarButton @click="openSideBar = true">
    <heroicons-outline:menu-alt-2 />
  </NavBarButton>
</template>
