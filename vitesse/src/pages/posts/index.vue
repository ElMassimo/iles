<script setup lang="ts">
let posts = []

if (import.meta.env.SSR) {
  console.log('awesome')
}
</script>

<template>
  <h1>Posts</h1>
  <ul>
    <li v-for="post in posts" class="flex flex-col">
      <h2>{{ post.title }}</h2>
    </li>
  </ul>
</template>

<route lang="yaml">
meta:
  layout: home
</route>
