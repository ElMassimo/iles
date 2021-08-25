<script setup lang="ts">
import AudioPlayer from '~/components/AudioPlayer.vue'

const posts = import.meta.globEager('./posts/**/*.{md,mdx}')
</script>

<template>
  <h1 class="font-extrabold text-5xl mb-16">Posts</h1>
  <ul>
    <li v-for="(post, file) in posts" :key="post.title" class="mb-8">
      <h2 class="text-2xl font-bold tracking-tight mb-4">
        <a :href="file.slice(1, file.length).replace('.mdx', '')">{{ post.title }}</a>
      </h2>
      <article class="prose">
        <component :is="post.default" :components="{ AudioPlayer }"/>
      </article>
    </li>
  </ul>
</template>

<route lang="yaml">
meta:
  layout: home
</route>
