<script setup lang="ts">
import { usePage } from 'iles'
import { usePosts } from '~/logic/posts'

const posts = usePosts()

let { frontmatter: post } = $(usePage())

let currentIndex = $computed(() => posts.findIndex(p => p.href === post.href))
let date = $computed(() => posts[currentIndex]?.date)
let nextPost = $computed(() => posts[currentIndex - 1])
let prevPost = $computed(() => posts[currentIndex + 1])
</script>

<template>
  <Layout name="default">
    <article class="xl:divide-y xl:divide-gray-200">
      <header class="pt-6 xl:pb-10 space-y-1 text-center">
        <Date :date="post.date" client:idle v-bind="post"/>
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
        <Author v-bind="post"/>
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
          <div class="pt-8">
            <a class="link" href="/">← Back to the blog</a>
          </div>
        </footer>
      </div>
    </article>
  </Layout>
</template>
