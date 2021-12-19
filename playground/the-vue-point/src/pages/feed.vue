<page>
path: /feed.rss
</page>

<script setup lang="ts">
import type { FeedOptions, FeedItem } from '@islands/feed'
import { getPosts } from '~/logic/posts'

const { site } = usePage()
const url = site.url

const options: FeedOptions = {
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

const posts = $(getPosts())
const items = $computed(() => posts.map(async (doc) => {
  const post = await doc.component()
  return {
    title: post.title,
    link: `${url}${post.href}`,
    date: post.date,
    description: () => post.excerpt,
    content: post,
    author: [
      {
        name: post.author,
        link: post.twitter
          ? `https://twitter.com/${post.twitter}`
          : undefined,
      },
    ],
  } as FeedItem
}))
</script>

<template>
  <RenderFeed format="rss" v-bind="{ options, items }"/>
</template>
