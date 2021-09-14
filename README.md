<h1 align="center">
  <a href="https://vite-ruby.netlify.app/">
    <img src="https://raw.githubusercontent.com/ElMassimo/iles/main/docs/public/logo.svg" width="200px"/>
  </a>

  <br>

  <a href="https://vite-ruby.netlify.app/">
    <samp>îles</samp>
  </a>

  <p align='center'>Automatic partial hydration for <samp>Vue</samp> in <samp>Vite.js</samp></p>

  <br>

  <p align="center">
    <a href='https://www.npmjs.com/package/iles'>
      <img src='https://img.shields.io/npm/v/iles?color=222&style=flat-square'>
    </a>
    <a href="https://github.com/ElMassimo/vite_ruby/blob/master/LICENSE.txt">
      <img alt="License" src="https://img.shields.io/badge/license-MIT-428F7E.svg"/>
    </a>
  </p>
</h1>

[Partial Hydration]: https://jasonformat.com/islands-architecture/
[Vite.js]: https://vitejs.dev/
[Vue]: https://v3.vuejs.org/
[MDX]: https://mdxjs.com/
[vite-plugin-pages]: https://github.com/hannoeru/vite-plugin-pages
[unplugin-vue-components]: https://github.com/antfu/unplugin-vue-components
[Demo]: https://vue-iles.netlify.app/

[îles] is a static-site generator that provides automatic [partial hydration].

Use [Vue] and [MDX] to build your website, while enjoying the smooth development
experience provided by [Vite.js].

When building for production, use directives to specify which components are
interactive, and [îles] will take care of shipping the minimal amount of JS needed.

[Demo]

## Features ✨

- 🏝 Automatic [Partial Hydration]
  
  Ship JS only for the interactive bits, by default that's zero.

- ⚡️ Powered by [Vite.js]

  That means the server starts fast, and HMR feels instant.

- 📖 Great MDX Support
  
  Use components inside markdown. With HMR, the browser becomes a live preview.

- 🧱 Layouts and [Components][unplugin-vue-components]

- 🛣 [File-system Based Routing][vite-plugin-pages]

## Project Status

⚠️ Alpha. If you are reading this, you probably arrived here too early 😄
