<route>
path: /feed.rss
layout: false
</route>

<script setup lang="ts">
import { plainText, useVueRenderer } from 'iles'
import { defineAsyncComponent } from 'vue'
import { usePosts, Post } from '~/logic/posts'

const url = 'https://blog.vuejs.org'
const options = {
  title: 'The Vue Point',
  description: 'The offical blog for the Vue.js project',
  id: url,
  link: url,
  language: 'en',
  image: 'https://vuejs.org/images/logo.png',
  favicon: `${url}/favicon.ico`,
  copyright:
    'Copyright (c) 2021-present, Yuxi (Evan) You and blog contributors',
}

let { posts } = $(usePosts())
const renderVNodes = useVueRenderer()

let rssPosts = $computed(() => posts.map(post => toRSS(post)))

async function renderFeedItems () {
  return await Promise.all(rssPosts.map(async post => await post))
}

async function renderRSS () {
  const items = await renderFeedItems()
  if (!import.meta.env.SSR) return JSON.stringify({ ...options, items }, null, 2)
  const { Feed } = require('feed')
  const feed = new Feed(options)
  items.forEach(item => feed.addItem(item))
  return feed.rss2()
}

async function toRSS (post: Post) {
  return {
    title: post.title,
    id: `${url}${post.href}`,
    link: `${url}${post.href}`,
    description: await renderVNodes(post.excerpt()),
    content: await renderVNodes(post.render()),
    author: [
      {
        name: post.author,
        link: post.twitter
          ? `https://twitter.com/${post.twitter}`
          : undefined,
      },
    ],
    date: new Date(post.date),
  }
}

const RSS = defineAsyncComponent(async () => plainText(await renderRSS()))
</script>

<template>
  <RSS/>
</template>
