<script setup lang="ts">
const goBack = () => history.back()
</script>

<template>
  <button class="m-3 text-sm mt-8 underline" @click="goBack">
    Go back
  </button>
</template>
