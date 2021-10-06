<p align="center">
  <a href="https://vue-iles.netlify.app/">
    <img src="https://github.com/ElMassimo/iles/blob/main/docs/images/banner.png"/>
  </a>
</p>

<p align="center">
  <small><em>îles — french word for "islands"</em></small>
</p>

<h3 align='center'>Islands of interactivity with <samp>Vue</samp> in <samp>Vite.js</samp></h3>

<p align="center">
  <a href='https://www.npmjs.com/package/iles'>
    <img src='https://img.shields.io/npm/v/iles?color=222&style=flat-square'>
  </a>
  <a href="https://github.com/ElMassimo/vite_ruby/blob/master/LICENSE.txt">
    <img alt="License" src="https://img.shields.io/badge/license-MIT-428F7E.svg"/>
  </a>
</p>

<hr/>

[îles]: https://github.com/ElMassimo/iles
[Partial Hydration]: https://jasonformat.com/islands-architecture/
[Vite.js]: https://vitejs.dev/
[Vue]: https://v3.vuejs.org/
[MDX]: https://mdxjs.com/
[xdm]: https://github.com/wooorm/xdm
[Astro]: https://docs.astro.build/core-concepts/component-hydration
[vite-plugin-pages]: https://github.com/hannoeru/vite-plugin-pages
[unplugin-vue-components]: https://github.com/antfu/unplugin-vue-components
[Live Demo]: https://vue-iles.netlify.app/
[requestIdleCallback]: https://developer.mozilla.org/en-US/docs/Web/API/Window/requestIdleCallback
[intersectionobserver]: https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API
[matchMedia]: https://developer.mozilla.org/en-US/docs/Web/API/Window/matchMedia
[Vitepress]: https://vitepress.vuejs.org/
[vite-ssg]: https://github.com/antfu/vite-ssg
[devtools1]: https://user-images.githubusercontent.com/1158253/133314267-f0ba784c-ff64-4ee8-b2bf-97ecffc2facd.jpg
[devtools2]: https://user-images.githubusercontent.com/1158253/133314279-1edc22d1-3ffb-414e-b994-212cb316593b.jpg
[twitter]: https://twitter.com/ilesjs

__[îles]__ is a static-site generator that provides automatic [partial hydration].

Use [Vue] and [MDX] to build your website, while enjoying the smooth development
experience provided by [Vite.js].

When building for production, use directives to specify which components are
interactive, and [îles] will take care of shipping the minimal amount of JS needed.

__[Live Demo]__

## Features ✨

- 🏝 Automatic [Partial Hydration]
  
  Ship JS only for the interactive bits, by default that's zero.

- ⚡️ Powered by [Vite.js]

  That means the server starts fast, and HMR feels instant.

- 📖 Great [MDX] Support
  
  Use components inside markdown. With HMR, the browser becomes a live preview.

- 🧱 Layouts and [Components][unplugin-vue-components]
  
  Use Vue components as layouts for Markdown or Vue pages.

- 🛣 [File-system Based Routing][vite-plugin-pages]

- 🛠 Vue [Devtools][devtools1] [Support][devtools2]

## Project Status

⚠️ Alpha. If you are reading this, you probably arrived here too early.

The roadmap is ambitious though 😄

## Installation 💿

```bash
npm install iles # OR yarn add iles
```

## Usage 🚀

The `iles` executable provides two commands, `serve` and `build`.

Add the following shortcuts to your `package.json`:

```json
{
  "scripts": {
    "dev": "iles --open",
    "build": "iles build",
    "preview": "vite preview --open"
  },
```

- <kbd>npm run dev</kbd>: start the development server
- <kbd>npm run build</kbd>: create a production build of the site

### Default App Structure 📂

```ts
src/
  ├── pages/
  │  ├── posts/
  │  │  ├── intro.mdx
  │  │  └── goodbye.mdx
  │  ├── about.mdx
  │  └── feed.vue
  │
  ├── components/
  │   ├── ReadingTime.vue
  │   └── Author.vue
  │
  └── layouts/
      ├── default.vue
      └── posts.vue
```

Components are auto-imported, but if you decide to add helpers or logic, you can
use `~/` which is aliased to the `src` dir. For example:

```ts
import { useDark } from '~/logic/dark'
```

## Hydration Directives 🏝

You can define which components should remain interactive in the production
build by using `client:` directives in your components (borrowed from [Astro]).

Any JS required for these components will be automatically inferred and optimized to perform partial hydration in the final build.

> No JS is shipped for components without a hydration directive! 🏝

Here's an example with MDX, an interactive audio player in a mostly static page:

```mdx
---
title: Song for You
audio: /song-for-you.mp3
---

I've recently recorded a song, listen:

<AudioPlayer {...frontmatter} client:visible/>
```

You can also use these directives inside your Vue components. In the following
example, the _Download_ link is rendered statically, while the `<Audio>`
component is interactive and will be hydrated when visible.

```vue
<template>
  <div class="audio-player">
    <Audio client:visible :src="audio" :initialDuration="initialDuration"/>
    <div>
      <a :href="audio" :download="`${title}.mp3`">
        Download the Song 
      </a>
    </div>
  </div>
</template>
```

### Hydration Strategies 🏝

The following hydration strategies are available.

- `client:load`
  Hydrates the component immediately as the page loads.

- `client:idle`
  Hydrate the component as soon as the main thread is [free][requestIdleCallback].

- `client:visible`
  Hydrates the component as soon as the element [enters the viewport][intersectionobserver].

- `client:media`
  Hydrates the component as soon as the browser [matches the given media query][matchMedia].

  Useful to avoid unnecessary work depending on the available viewport, such as in mobile devices.

- `client:only`
  Does not prerender the component during build. It's usually better to use one of the previous strategies, as it could create a flash of content.

## Configuration ⚙️

You can configure Vite.js as [usual](https://vitejs.dev/config/).

Alternatively, you can configure [îles] using an `iles.config.ts` file:

```ts
import { defineConfig } from 'iles'

import iconsResolver from 'unplugin-icons/resolver'

import icons from 'unplugin-icons/vite'
import windicss from 'vite-plugin-windicss'

export default defineConfig({
  vite: {
    plugins: [
      icons({ autoInstall: true }),
      windicss(),
    ],
  },
  components: {
    resolvers: [iconsResolver({ componentPrefix: '' })],
  },
  markdown: {
    extendFrontmatter (frontmatter, filename) {
      if (filename.includes('/posts/'))
        return { ...frontmatter, layout: 'post' }
    },
  },
})
```

To configure the app, you may use `src/app.ts`:

```ts
import { defineApp } from 'iles'

export default defineApp({
  head: {
    title: 'Site Title',
    meta: [
      { name: 'description', content: 'Site Description.' },
    ],
  },
  enhanceApp ({ app, head, router }) {
    // Configure the app to add plugins.
  },
})
```

You can use TypeScript autocompletion to discover available options.

## Documentation 📖

A documentation website is __coming soon__.

## News 🗞

Follow [îles][twitter] on [Twitter].

## Acknowledgements 🙇‍♂️

- [Vite.js] and [Vue]: for enabling an amazing development experience
- [Astro](https://astro.build): for sharing a novel way to define islands
- [xdm]: provides amazing flexibility when processing Markdown
- [vue-router], [@vueuse/head], and [vite-plugin-pages]: the backbone of this library
- [unplugin-vue-components]: allows you to avoid the boilerplate
- [Vitepress] and [vite-ssg]: for their different ideas on SSR

[vue-router]: https://next.router.vuejs.org/
[@vueuse/head]: https://github.com/vueuse/head
