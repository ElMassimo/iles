<script setup lang="ts">
import { usePage } from 'iles'
import { getPosts } from '~/logic/posts'
import { computed } from 'vue'

const posts = getPosts()

const { page } = usePage()

const currentIndex = computed(() => posts.value.findIndex(p => p.href === page.value.href))
const post = computed(() => posts.value[currentIndex.value])
const nextPost = computed(() => posts.value[currentIndex.value - 1])
const prevPost = computed(() => posts.value[currentIndex.value + 1])

const author = computed(() => {
  const { twitter, avatar, gravatar, author } = post.value
  return { twitter, avatar, gravatar, author }
})
</script>

<template layout="default">
  <article class="xl:divide-y xl:divide-gray-200">
    <header class="pt-6 xl:pb-10 space-y-1 text-center">
      <PostDate :date="post.date"/>
      <h1
        class="
          text-3xl
          leading-9
          font-extrabold
          text-gray-900
          tracking-tight
          sm:text-4xl sm:leading-10
          md:text-5xl
        "
      >{{ post.title }}</h1>
    </header>

    <div
      class="
        divide-y
        xl:divide-y-0
        divide-gray-200
        xl:grid xl:grid-cols-4 xl:gap-x-10
        pb-16
        xl:pb-20
      "
      style="grid-template-rows: auto 1fr"
    >
      <Author v-bind="author"/>
      <div class="divide-y divide-gray-200 xl:pb-0 xl:col-span-3 xl:row-span-2">
        <div class="prose max-w-none pt-10 pb-8">
          <slot/>
        </div>
      </div>

      <footer
        class="
          text-sm
          font-medium
          leading-5
          divide-y divide-gray-200
          xl:col-start-1 xl:row-start-2
        "
      >
        <div v-if="nextPost" class="py-8">
          <h2 class="text-xs tracking-wide uppercase text-gray-500">
            Next Article
          </h2>
          <div class="link">
            <a :href="nextPost.href">{{ nextPost.title }}</a>
          </div>
        </div>
        <div v-if="prevPost" class="py-8">
          <h2 class="text-xs tracking-wide uppercase text-gray-500">
            Previous Article
          </h2>
          <div class="link">
            <a :href="prevPost.href">{{ prevPost.title }}</a>
          </div>
        </div>
        <BackLink class="block pt-8" client:none href="/">Back to the blog</BackLink>
      </footer>
    </div>
  </article>
</template>
