<route>
skipFooter: true
</route>

<script setup lang="ts">
import soonSrc from '/images/soon.jpg'
</script>

<template>
  <div class="flex flex-col items-center">
    <img :src="soonSrc" alt="Coming Soon" title="Coming Soon">
  </div>
</template>
