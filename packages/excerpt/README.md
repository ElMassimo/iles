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
  <h3><samp>@islands/excerpt</samp></h3>
  <img width="2000" height="0">
</p>
</td>
</tbody>
</table>
</p>

[îles]: https://github.com/ElMassimo/iles
[docs]: https://iles-docs.netlify.app
[markdown]: https://iles-docs.netlify.app/guide/markdown

[pageData]: https://iles-docs.netlify.app/guide/development#using-page-data
[SEO tags]: https://iles-docs.netlify.app/guide/meta-tags
[RSS feeds]: https://iles-docs.netlify.app/guide/rss

An [îles] module to extract an excerpt from [MDX documents][markdown]:

- 📖 sets `meta.excerpt`, useful for [SEO tags] and [RSS feeds]

- 🏷 can render HTML by using the `excerpt` prop in an MDX component

- ⚙️ `maxLength`, `separator`, and `extract` options to customize excerpt


### Installation 💿

```ts
// iles.config.ts
import { defineConfig } from 'iles'

export default defineConfig({
  modules: [
    ['@islands/excerpt', { maxLength: 140 }],
  ],
})
```

### Usage 🚀

Use [`meta`][pageData] to access a text excerpt for the current page:

```js
const { meta } = usePage()
const text = meta.excerpt
```

When importing MDX components, you can also render an HTML version of the
excerpt by passing an `excerpt: true` prop.

```vue
<script setup>
import Introduction from '~/pages/intro.mdx'

const pages = Object.values(import.globEagerDefault('~/pages/posts/**/*.mdx'))
</script>

<template>
  <Introduction excerpt/>
  <template v-for="page in pages">
    <component :is="page" excerpt/>
  </template>
</template>
```
