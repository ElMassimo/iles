<route lang="yaml">
layout: default
alias: ['/guide/pages']
</route>

<script setup lang="ts">
import soonSrc from '/images/soon.jpg'
</script>


<template>
  <div class="flex place-center">
    <img :src="soonSrc" alt="Coming Soon" title="Coming Soon"/>
  </div>
</template>

