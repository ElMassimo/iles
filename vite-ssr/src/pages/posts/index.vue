<script setup lang="ts">
import { defineComponent } from 'vue'
import AudioPlayer from '~/components/AudioPlayer.vue'

let posts = Object.values(import.meta.globEager('./*.{md,mdx}'))

console.log({ posts })

const Wrapper = 'main'
</script>

<template>
  <h1 class="font-extrabold text-5xl mb-8">Posts</h1>
  <ul>
    <li v-for="post in posts" class="flex flex-col mb-4 w-max-65ch mx-auto">
      <h2 class="font-bold text-lg">{{ post.title }}</h2>
      <component :is="post.default" :components="{ wrapper: Wrapper, AudioPlayer }"/>
    </li>
  </ul>
</template>

<route lang="yaml">
meta:
  layout: home
</route>
