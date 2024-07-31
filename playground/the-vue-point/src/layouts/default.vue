<script setup lang="ts">
useHead({
  script: [
    { async: true, children: 'console.log("Powered by îles 🏝", "https://iles-docs.netlify.app")' },
  ],
})
</script>

<template>
  <MetaTags />
  <div class="antialiased">
    <div class="max-w-3xl mx-auto px-4 sm:px-6 xl:max-w-5xl xl:px-0">
      <nav class="flex justify-between items-center py-10 font-bold">
        <a class="sm:text-xl flex items-center h-8" href="/" aria-label="The Vue Point">
          <img class="inline-block h-8" height="32" alt="logo" src="/logo.svg">
          <span v-if="$route.name !== 'index'" class="hidden md:inline mx-2">The Vue Point with</span>
          <span v-if="$route.name !== 'index'" class="md:hidden mx-2">+</span>
          <span v-else class="mx-1 sm:mx-2">+</span>
          <img class="inline-block h-7 -mt-2.5" height="28" alt="logo" src="/iles.svg">
        </a>
        <NavBarLinks client:none />
      </nav>
    </div>
    <main class="max-w-3xl mx-auto px-4 sm:px-6 xl:max-w-5xl xl:px-0">
      <slot />
      <footer v-if="!$frontmatter.hideFooter" class="w-full xl:grid xl:grid-cols-4">
        <div class="pb-12 text-center text-sm xl:col-start-2 xl:col-span-3">
          <a class="inline-block" href="https://iles-docs.netlify.app">
            Built with
            <img class="iles inline-block h-6 ml-0.5 -mt-3" height="28" alt="logo" src="/iles.svg">
          </a>
        </div>
      </footer>
    </main>
  </div>
</template>
