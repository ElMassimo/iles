<script setup lang="ts">
import { useHead } from 'iles'
import { useClearPosts } from '~/logic/posts'

const clear = useClearPosts()

const isDev = import.meta.env.DEV

if (import.meta.env.PROD) {
  useHead({
    script: [
      { children: 'console.log("Powered by îles 🏝", "https://iles-docs.netlify.app")' },
    ],
  })
}
</script>

<template>
  <div class="antialiased">
    <div class="max-w-3xl mx-auto px-4 sm:px-6 xl:max-w-5xl xl:px-0">
      <nav class="flex justify-between items-center py-10 font-bold">
        <a class="text-xl" href="/" aria-label="The Vue Point">
          <img class="inline-block mr-2" style="width:36px" alt="logo" src="/logo.svg">
          <span v-if="$route.name !== 'index'" class="hidden md:inline">The Vue Point</span>
        </a>
        <div class="text-base text-gray-500 leading-5">
          <NavBarLinks client:none/>
          <button v-if="isDev" class="top-4 right-4 absolute" @click="clear">
            <CarbonReset/>
          </button>
        </div>
      </nav>
    </div>
    <main class="max-w-3xl mx-auto px-4 sm:px-6 xl:max-w-5xl xl:px-0">
      <slot/>
    </main>
  </div>
</template>
