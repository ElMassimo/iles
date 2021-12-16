<script setup lang="ts">
import { useHead, provideMDXComponents } from 'iles'

if (import.meta.env.PROD) {
  useHead({
    script: [
      { type: 'module', async: true, children: 'console.log("Powered by îles 🏝", "https://iles-docs.netlify.app")' },
    ],
  })
}

provideMDXComponents({
  strong: 'b',
})
</script>

<template>
  <div class="antialiased">
    <div class="max-w-3xl mx-auto px-4 sm:px-6 xl:max-w-5xl xl:px-0">
      <nav class="flex justify-between items-center py-10 font-bold">
        <a class="text-xl" href="/" aria-label="The Vue Point">
          <img class="inline-block mr-2" style="width:36px" alt="logo" src="/logo.svg">
          <span v-if="$route.name !== 'index'" class="hidden md:inline">The Vue Point</span>
        </a>
        <NavBarLinks client:none/>
      </nav>
    </div>
    <main class="max-w-3xl mx-auto px-4 sm:px-6 xl:max-w-5xl xl:px-0">
      <slot/>
    </main>
  </div>
</template>
