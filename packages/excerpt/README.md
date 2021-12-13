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

[SEO tags]: https://iles-docs.netlify.app/guide/meta-tags
[RSS feeds]: https://iles-docs.netlify.app/guide/rss

An [îles] module that can parse an excerpt from [MDX documents][markdown]:

- 📖 sets `meta.excerpt` useful for [SEO tags] and [RSS feeds]

- 🏷 can render HTML by passing `excerpt: true` prop to the doc component

### Usage 🚀

```ts
// iles.config.ts
import { defineConfig } from 'iles'

export default defineConfig({
  modules: [
    ['@islands/excerpt', { maxLength: 140 }],
  ],
})
```
