<script setup lang="ts">
import DarkSwitch from '~/components/DarkSwitch.vue'
</script>

<template>
  <main class="px-4 py-10 w-max-65ch mx-auto">
    <DarkSwitch client:media="(min-width: 700px)"/>
    <router-view v-bind="$attrs"/>
  </main>
</template>
