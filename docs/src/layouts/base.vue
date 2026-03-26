<script client:load lang="ts">
if (import.meta.env.PROD) console.log("Powered by îles 🏝", "https://iles-docs.netlify.app");
</script>

<template>
  <MetaTags />
  <TheNavBar />
  <slot />
  <ReloadPrompt />
</template>
