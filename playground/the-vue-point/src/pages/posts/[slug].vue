<script lang="ts">
import { definePageComponent } from 'iles'
import { getPosts } from '~/logic/posts'

export default definePageComponent({
  async getStaticPaths () {
    const posts = await getPosts()
    return posts.map((post, i) => ({
      params: { slug: post.slug },
      props: { post, nextPost: posts[i - 1], prevPost: posts[i + 1] },
    }))
  },
})
</script>

<script setup lang="ts">
import { usePage } from 'iles'
import type { Post } from '~/logic/posts'

const props = defineProps<{ post: Post; nextPost: Post; prevPost: Post }>()

let { frontmatter, page } = usePage()

let author = $computed(() => {
  frontmatter.title = props.post.title
  frontmatter.description = props.post.excerpt
  const { twitter, gravatar, author } = props.post
  return { twitter, gravatar, author }
})
</script>

<template layout="default">
  <article v-if="post" class="xl:divide-y xl:divide-gray-200">
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
          <Markdown>
            {{ post.excerpt }}
            {{ post.content }}
          </Markdown>
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
          <BackLink client:none href="/">Back to the blog</BackLink>
        </div>
      </footer>
    </div>
  </article>
</template>
