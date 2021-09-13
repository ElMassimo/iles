<script setup lang="ts">
import Layout from './default.vue'
import { usePosts } from '~/logic/posts'

const posts = usePosts()
</script>

<template>
  <Layout>
    <div class="divide-y divide-gray-200">
      <div class="pt-6 pb-8 space-y-2 md:space-y-5">
        <h1
          class="
            text-3xl
            leading-9
            font-extrabold
            text-gray-900
            tracking-tight
            sm:text-4xl sm:leading-10
            md:text-6xl md:leading-14
          "
        >
          {{ $frontmatter.title }}
        </h1>
        <p class="text-lg leading-7 text-gray-500">{{ $frontmatter.subtext }}</p>
      </div>
      <ul class="divide-y divide-gray-200">
        <li v-for="post of posts" :key="post.href" class="py-12">
          <article class="space-y-2 xl:(grid grid-cols-4 space-y-0 items-baseline)">
            <Date :date="post.date"/>
            <div class="space-y-5 xl:col-span-3">
              <div class="space-y-6">
                <h2 class="text-2xl leading-8 font-bold tracking-tight">
                  <a class="text-gray-900" :href="post.href">{{ post.title }}</a>
                </h2>
                <div class="prose max-w-none text-gray-500">
                  <component :is="post.excerpt"/>
                </div>
              </div>
              <div class="text-base leading-6 font-medium">
                <a class="link" aria-label="read more" :href="post.href">Read more →</a>
              </div>
            </div>
          </article>
        </li>
      </ul>
    </div>
  </Layout>
</template>
