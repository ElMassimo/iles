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
  <h3><samp>@islands/images</samp></h3>
  <img width="2000" height="0">
</p>
</td>
</tbody>
</table>
</p>

[îles]: https://github.com/ElMassimo/iles
[docs]: https://iles-docs.netlify.app
[MDX]: https://iles-docs.netlify.app/guide/markdown
[vite-plugin-image-presets]: https://github.com/ElMassimo/vite-plugin-image-presets

An [îles] module that configures [`vite-plugin-image-presets`][vite-plugin-image-presets], allowing you to easily define presets to optimize and convert images:

- 🖼 define [presets][vite-plugin-image-presets] once, apply everywhere

- 🖥 customize formats, srcset, & sizes

- ⚡️ on-demand in dev, cached at build time 📦

### Configuration ⚙️

Add the module to `iles.config.ts`:

```js
// iles.config.ts
import { defineConfig } from 'iles'

import images, { hdPreset } from '@islands/images'

export default defineConfig({
  modules: [
    images({
      post: hdPreset({
        class: 'img',
        loading: 'lazy',
        widths: [268, 655],
        formats: {
          webp: { quality: 44 },
          jpeg: { quality: 70 },
        },
      }),
    }),
  ],
})
```

Use the `preset` query parameter to obtain an array of `source` and `img` attrs:

```js
import thumbnails from '~/images/logo.jpg?preset=thumbnail'

expect(thumbnails).toEqual([
  {
    type: 'image/webp',
    srcset: '/assets/logo.ffc730c4.webp 48w, /assets/logo.1f874174.webp 96w',
  },
  {
    type: 'image/jpeg',
    srcset: '/assets/logo.063759b1.jpeg 48w, /assets/logo.81d93491.jpeg 96w',
    src: '/assets/logo.81d93491.jpeg',
    class: 'img thumb',
    loading: 'lazy',
  },
])
```

You can also use the `src` and `srcset` query parameters for direct usage:

```js
import srcset from '~/images/logo.jpg?preset=thumbnail&srcset'

expect(srcset).toEqual('/assets/logo.063759b1.jpeg 48w, /assets/logo.81d93491.jpeg 96w')


import src from '~/images/logo.jpg?preset=thumbnail&src'

expect(src).toEqual('/assets/logo.81d93491.jpeg')
```

### Usage 🚀

An `Picture` Vue component is provided out of the box, which can receive any
applied preset and render a `picture` tag with the corresponding `source` and `img` tags.

You may use it explicitly in Vue components:

```vue
<script setup>
import logoThumbnail from '~/images/logo.jpg?preset=thumbnail'
</script>

<template>
  <Picture :src="logoThumbnail"/>
</template>
```

### Markdown Usage

If you would like to use image presets in [MDX] documents, it's recommended
to add an `img: Picture` shorthand in `src/app.ts`:

```ts
  mdxComponents: {
    img: Picture,
  },
```

That will allow you to use presets in [MDX] without using a special syntax:

```mdx
![Logo](~/images/logo.jpg?preset=thumbnail)
```

Additionally, you can use `markdown.withImageSrc` to easily apply a preset on
all images referenced in [MDX]:

```ts
// iles.config.ts
import { defineConfig } from 'iles'

export default defineConfig({
  markdown: {
    withImageSrc (src, file) {
      if (!src.includes('?'))
        return `${src}?preset=post`
    },
  }
})
```

and do:

```mdx
![Logo](~/images/logo.jpg)
```
