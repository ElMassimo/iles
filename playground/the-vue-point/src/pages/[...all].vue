<script setup lang="ts">
import { useRouter } from 'iles'
const router = useRouter()
</script>

<template>
  <div class="text-center">
    <h1 class="text-3xl font-bold">Page Not Found</h1>
    <div>
      <button class="underline m-3 text-sm mt-8" @click="router.back()">
        Go Back
      </button>
    </div>
  </div>
</template>
