<script lang="ts">
import { definePageComponent } from 'iles'
import { getPosts } from '~/logic/posts'
import { paginate } from '~/logic/pagination'

export default definePageComponent({
  getStaticPaths () {
    const posts = $(getPosts())
    return paginate(posts, { pageSize: 2 })
  },
})
</script>

<script setup lang="ts">
import type { Post } from '~/logic/posts'

defineProps<{
  items: Post[]
  nextPage?: number
  prevPage?: number
}>()
</script>

<template layout="default">
  <h1 class="text-3xl leading-9 font-extrabold text-gray-900 tracking-tight sm:text-4xl sm:leading-10 md:text-5xl">Paginated Posts</h1>
  <ul class="divide-y divide-gray-200">
    <li v-for="post of items" :key="post.href" class="py-12">
      <article class="space-y-2 xl:(grid grid-cols-4 space-y-0 items-baseline)">
        <PostDate :date="post.date"/>
        <div class="space-y-5 xl:col-span-3">
          <div class="space-y-6">
            <h2 class="text-2xl leading-8 font-bold tracking-tight">
              <a class="text-gray-900" :href="post.href">{{ post.title }}</a>
            </h2>
            <div class="prose max-w-none text-gray-500">
              <component :is="post" excerpt/>
            </div>
          </div>
          <div class="text-base leading-6 font-medium">
            <a class="link" aria-label="read more" :href="post.href">Read more →</a>
          </div>
        </div>
      </article>
    </li>
  </ul>
  <div class="py-8 grid grid-cols-2">
    <div v-if="prevPage" class="link col-start-1">
      <router-link :to="{ params: { page: prevPage } }">← Newer</router-link>
    </div>
    <div v-if="nextPage" class="link col-start-2 text-right">
      <router-link :to="{ params: { page: nextPage } }">Older →</router-link>
    </div>
  </div>
</template>
