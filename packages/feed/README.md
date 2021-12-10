<p align="center">
  <a href="https://iles-docs.netlify.app">
    <img src="https://github.com/ElMassimo/iles/blob/main/docs/images/banner.png"/>
  </a>
</p>

<p align="center">
<table>
<tbody>
<td align="center">
<br/>
<p align="center">
  <h3><samp>@islands/feed</samp></h3>
  <img width="2000" height="0">
</p>
</td>
</tbody>
</table>
</p>

[îles]: https://github.com/ElMassimo/iles
[routing]: https://iles-docs.netlify.app/guide/routing
[feed]: https://github.com/jpmonette/feed

An [îles] module to generate feeds for your site:

- 📻 supports RSS, Atom, and JSON feeds

- ⚡️ HMR during development to debug the result

- 💪🏼 strongly typed, powered by [`feed`][feed]

### Installation 💿

```ts
// iles.config.ts
import { defineConfig } from 'iles'

export default defineConfig({
  modules: [
    '@islands/feed',
  ],
})
```

### Usage 🚀

To generate a feed, create a Vue SFC and specify a [`path`][routing] with the appropriate
extension:

```
<page>
path: /feed.atom
</page>

<script setup lang="ts">
import type { FeedOptions, FeedItem } from '@islands/feed'

const { site } = usePage()

const url = site.url

const options: FeedOptions = {
  title: 'The Vue Point',
  description: 'The official blog for the Vue.js project',
  id: url,
  link: url,
  language: 'en',
  image: 'https://vuejs.org/images/logo.png',
  copyright: 'Copyright (c) 2021-present',
}

const posts = Object.values(import.meta.globEagerDefault('./posts/**/*.mdx'))

const items = posts.map<FeedItem>(post => ({
  link: `${url}${post.href}`,
  date: new Date(post.date),
  title: post.title,
  description: post.description,
  content: post,
}))
</script>

<template>
  <RenderFeed format="atom" :options="options" :items="items"/>
</template>
```

Check the [`feed` documentation][feed] for more information.
