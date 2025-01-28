<script setup lang="ts">
import { getImage } from '~/logic/utils';

const posts = getPosts()
const { page, site } = usePage()

const currentIndex = computed(() =>
  posts.value.findIndex((p) => p.href === page.value.href),
)
const post = computed(() => currentIndex.value > -1 ? posts.value[currentIndex.value] : posts.value[0])

const title = computed(() => {
  return post.value?.title
})

const ogImage = computed(() => {
  const image = getImage(post.value?.image)
  return `${site.url}${image}`
})

const author = computed(() => {
  return post.value?.author
})

const twitterCreator = computed(() => {
  return post.value?.twitter
})

useSeoMeta({
  author,

  // Open Graph / Facebook / LinkedIn / Discord
  ogImage,
  ogImageAlt: title,

  // Twitter (X)
  twitterImage: ogImage,
  twitterImageAlt: title,
  twitterCreator,
})
</script>

<template>
  <div></div>
</template>