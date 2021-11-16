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
  <h3><samp>@islands/mdx</samp></h3>
  <img width="2000" height="0">
</p>
</td>
</tbody>
</table>
</p>

[îles]: https://github.com/ElMassimo/iles
[docs]: https://iles-docs.netlify.app
[xdm]: https://github.com/wooorm/xdm
[frontmatter]: https://iles-docs.netlify.app/guide/markdown#frontmatter-and-meta
[mdx documents]: https://iles-docs.netlify.app/guide/markdown
[resolveComponent]: https://v3.vuejs.org/api/global-api.html#resolvecomponent
[unplugin-vue-components]: https://github.com/antfu/unplugin-vue-components

An [îles] module that adds support for [MDX documents], powered by [XDM].

It also injects a [recma][xdm] plugin to resolve Vue components in [MDX documents]:

- 🌎 you can use globally registered components
- 🧱 [`unplugin-vue-components`][unplugin-vue-components] can statically resolve and import components, so you don't need to manually provide components
