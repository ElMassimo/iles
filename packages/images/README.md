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
[alias]: https://iles-docs.netlify.app/guide/development#default-app-structure
[vite-plugin-image-presets]: https://github.com/ElMassimo/vite-plugin-image-presets

An [îles] module that configures [`vite-plugin-image-presets`][vite-plugin-image-presets], allowing you to easily define presets to optimize and convert images:

- 🖼 define [presets][vite-plugin-image-presets] once, apply everywhere

- 🔗 use presets directly in `img`, `source`, and `Picture`

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
      thumnail: hdPreset({
        class: 'img thumb',
        loading: 'lazy',
        widths: [48, 96],
        formats: {
          webp: { quality: 44 },
          original: {},
        },
      }),
    }),
  ],
})
```

### Usage 🚀

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

#### Images in Vue

A `Picture` Vue component is provided out of the box, which can receive any
applied preset using the `src` prop, and renders a `picture` tag with the
corresponding `source` and `img` tags.

```vue
<template>
  <Picture src="@/images/logo.jpg?preset=thumbnail"/>
</template>
```

Make sure to use an [alias] that starts with `@`, as Vue [currently has a bug](https://github.com/vuejs/vue-next/issues/4819) that does not transform certain
relative imports.

#### Images in Markdown

The `Picture` component will be automatically used for any images in [MDX],
allowing you to use a preset while keeping the standard syntax:

```mdx
![Landscape](~/images/mountains.jpg?preset=narrow)
```

Additionally, you can use `markdown.withImageSrc` to easily apply a preset to
images referenced in [MDX]:

```ts
// iles.config.ts
import { defineConfig } from 'iles'

export default defineConfig({
  markdown: {
    withImageSrc (src, file) {
      // Example: If no preset was manually specified, use the `narrow` preset.
      if (!src.includes('?'))
        return `${src}?preset=narrow`
    },
  }
})
```

allowing you to keep the MDX cleaner:

```mdx
![Landscape](~/images/mountains.jpg)
```
