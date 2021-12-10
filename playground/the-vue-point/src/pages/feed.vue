<page>
path: /feed.rss
</page>

<script setup lang="ts">
import { getPosts } from '~/logic/posts'

const { site } = usePage()
const url = site.url

const options = {
  title: 'The Vue Point',
  description: 'The official blog for the Vue.js project',
  id: url,
  link: url,
  language: 'en',
  image: 'https://vuejs.org/images/logo.png',
  favicon: `${url}/favicon.ico`,
  copyright:
    'Copyright (c) 2021-present, Yuxi (Evan) You and blog contributors',
}

let items = $computed(() => getPosts().value.map(post => ({
  title: post.title,
  link: `${url}${post.href}`,
  date: new Date(post.date),
  description: post.excerpt,
  content: post.render,
  author: [
    {
      name: post.author,
      link: post.twitter
        ? `https://twitter.com/${post.twitter}`
        : undefined,
    },
  ],
})))
</script>

<template>
  <RenderFeed format="rss" v-bind="{ options, items }"/>
</template>
