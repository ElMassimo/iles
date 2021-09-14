<h1 align="center">
  <a href="https://vue-iles.netlify.app/">
    <img src="https://github.com/ElMassimo/iles/blob/main/docs/public/logo.svg" width="200px"/>
  </a>

  <br/>

  <a href="https://vue-iles.netlify.app/">
    <samp>îles</samp>
  </a>
</h1>

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
[vite-plugin-pages]: https://github.com/hannoeru/vite-plugin-pages
[unplugin-vue-components]: https://github.com/antfu/unplugin-vue-components
[Live Demo]: https://vue-iles.netlify.app/

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

- 📖 Great MDX Support
  
  Use components inside markdown. With HMR, the browser becomes a live preview.

- 🧱 Layouts and [Components][unplugin-vue-components]
  
  Use Vue components as layouts for Markdown or Vue pages.

- 🛣 [File-system Based Routing][vite-plugin-pages]

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
      icons(),
      windicss(),
    ],
  },
  components: {
    resolvers: [iconsResolver({ componentPrefix: '' })],
  },
  pages: {
    extendRoute (route) {
      if (route.path.startsWith('/posts'))
        return { ...route, meta: { layout: 'post', ...route.meta } }
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
      { property: 'description', content: 'Site Description.' },
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
