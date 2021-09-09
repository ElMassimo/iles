<script setup lang="ts">
const posts = import.meta.globEager('./posts/**/*.{md,mdx}')
</script>

<template>
  <h1 class="font-extrabold text-5xl mb-16">Posts</h1>
  <ul>
    <li v-for="(post, file) in posts" :key="post.title" class="mb-8">
      <h2 class="text-2xl font-bold tracking-tight mb-4">
        <router-link :to="file.slice(1, file.length).replace('.mdx', '')">{{ post.title }}</router-link>
      </h2>
      <article class="prose">
        <component :is="post.default"/>
      </article>
    </li>
  </ul>
</template>

<route lang="yaml">
meta:
  layout: home
</route>
