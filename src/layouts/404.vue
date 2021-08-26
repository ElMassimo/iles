<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()
</script>

<template>
  <main class="px-4 py-10 text-center text-teal-700 dark:text-gray-200">
    <div>
      <p class="text-4xl">
        <carbon-warning class="inline-block" />
      </p>
    </div>
    <router-view v-bind="$attrs" />
    <div>
      <button
        class="btn m-3 text-sm mt-8"
        @click="router.back()"
      >
        Go Back
      </button>
    </div>
  </main>
</template>
