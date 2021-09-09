<script setup lang="ts">
import Default from './default.vue'
import { useRouter } from 'iles'

const router = useRouter()
</script>

<template>
  <Default class="text-center">
    <div>
      <p class="text-4xl">
        <carbon-warning class="inline-block"/>
      </p>
    </div>
    <slot/>
    <div>
      <button
        class="btn m-3 text-sm mt-8"
        @click="router.back()"
      >
        Go Back
      </button>
    </div>
  </Default>
</template>
