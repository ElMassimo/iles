<p align="center">
  <a href="https://iles-docs.netlify.app">
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
[docs]: https://iles-docs.netlify.app
[Partial Hydration]: https://jasonformat.com/islands-architecture/
[Vite.js]: https://vitejs.dev/
[Vue]: https://v3.vuejs.org/
[MDX]: https://mdxjs.com/
[xdm]: https://github.com/wooorm/xdm
[Astro]: https://docs.astro.build/core-concepts/component-hydration
[vite-plugin-pages]: https://github.com/hannoeru/vite-plugin-pages
[unplugin-vue-components]: https://github.com/antfu/unplugin-vue-components

[requestIdleCallback]: https://developer.mozilla.org/en-US/docs/Web/API/Window/requestIdleCallback
[intersectionobserver]: https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API
[matchMedia]: https://developer.mozilla.org/en-US/docs/Web/API/Window/matchMedia
[Vitepress]: https://vitepress.vuejs.org/
[vite-ssg]: https://github.com/antfu/vite-ssg
[devtools1]: https://user-images.githubusercontent.com/1158253/133314267-f0ba784c-ff64-4ee8-b2bf-97ecffc2facd.jpg
[devtools2]: https://user-images.githubusercontent.com/1158253/133314279-1edc22d1-3ffb-414e-b994-212cb316593b.jpg
[twitter]: https://twitter.com/ilesjs
[follow me]:  https://twitter.com/MaximoMussini

[hydration]: https://iles-docs.netlify.app/guide/hydration
[markdown]: https://iles-docs.netlify.app/guide/markdown
[guide]: https://iles-docs.netlify.app/guide/introduction
[pages]: https://iles-docs.netlify.app/guide/development#pages
[layouts]: https://iles-docs.netlify.app/guide/development#components
[components]: https://iles-docs.netlify.app/guide/development#components
[configuration reference]: https://iles-docs.netlify.app/config

[blog]: https://the-vue-point-with-iles.netlify.app/

__[îles]__ is a static-site generator that provides automatic [partial hydration].

Use [Vue] and [MDX] to build your website, while enjoying the smooth development
experience provided by [Vite.js].

When building for production, use directives to specify which components are
interactive, and [îles] will take care of shipping the minimal amount of JS needed.

## Features ✨

- 🏝 [Partial Hydration][hydration]
- ⚡️ Powered by [Vite.js] and [Vue]
- 📖 Great [Markdown] Support
- 🧱 [Layouts] and [Components] auto-import
- 🛣 [File-Based Routing][pages]
- 🛠 Vue [Devtools][devtools1] [Support][devtools2]

## Demos 🚀

__[Documentation Website][docs]__

__[Official Vue.js Blog][blog]__ 

## Installation 💿

```bash
pnpm init iles@next # or npm or yarn
```

## Documentation 📖

Visit the [documentation website][docs] to check out the [guides][guide] and searchable [configuration reference].

## News 🗞

[Follow me] or the [official îles account][twitter] on [Twitter].

## Acknowledgements 🙇‍♂️

- [Vite.js] and [Vue]: for enabling an amazing development experience
- [Astro](https://astro.build): for sharing a novel way to define islands
- [xdm]: provides amazing flexibility when processing Markdown
- [vue-router], [@vueuse/head], and [vite-plugin-pages]: the backbone of this library
- [unplugin-vue-components]: allows you to avoid the boilerplate
- [Vitepress] and [vite-ssg]: for their different ideas on SSR

[vue-router]: https://next.router.vuejs.org/
[@vueuse/head]: https://github.com/vueuse/head
