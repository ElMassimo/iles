<script setup lang="ts">
import { openSideBar } from '~/logic/sidebar'
</script>

<template>
  <NavBarButton @click="openSideBar = true">
    <HeroiconsOutlineMenuAlt2 />
  </NavBarButton>
</template>
