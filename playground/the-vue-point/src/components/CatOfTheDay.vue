<script setup lang="ts">
import {$fetch} from 'ofetch'
const [data] = await $fetch('https://api.thecatapi.com/v1/images/search')
</script>

<template>
  <img
    :src="data.url"
    alt="Boots"
    style="object-fit: cover; max-height: 600px"
  />
</template>

<style scoped></style>
