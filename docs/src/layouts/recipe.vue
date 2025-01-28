<script setup lang="ts">

const posts = getPosts()
const { page } = usePage()

const currentIndex = computed(() =>
  posts.value.findIndex((p) => p.href === page.value.href),
)
const post = computed(() => posts.value[currentIndex.value])
</script>

<template layout="default">
  <h1 v-if="post">
    {{ post.title }}
  </h1>
  <slot/>
</template>

<style scoped>
.prose h1#introduction {
    font-size: 1.5em;
    font-weight: 700;
    line-height: 1.3333333;
    margin-bottom: 1em;
    margin-top: 1.8em;
}
</style>