<script setup lang="ts">
import { usePosts } from '~/logic/posts'

const posts = usePosts()
</script>

<template>
  <h1 class="font-extrabold text-5xl mb-16">Posts</h1>
  <ul>
    <li v-for="post in posts" :key="post.title" class="mb-8">
      <h2 class="text-2xl font-bold tracking-tight mb-4">
        <a :href="post.href">{{ post.title }}</a>
      </h2>
      <article class="prose">
        <component :is="post.excerpt"/>
      </article>
    </li>
  </ul>
</template>

<route lang="yaml">
meta:
  layout: home
</route>
