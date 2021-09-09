<script setup lang="ts">
import Default from './default.vue'
</script>

<template>
  <Default>
    <template #switch>
      <DarkSwitch client:media="(min-width: 700px)"></DarkSwitch>
    </template>
    <template #default>
      <slot/>
    </template>
  </Default>
</template>
