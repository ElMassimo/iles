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
  <h3><samp>@islands/pwa</samp></h3>
  <img width="2000" height="0">
</p>
</td>
</tbody>
</table>
</p>

[îles]: https://github.com/ElMassimo/iles
[pwa]: https://iles-docs.netlify.app/guide/pwa
[vite-plugin-pwa]: https://github.com/antfu/vite-plugin-pwa

An [îles] module to add and configure [vite-plugin-pwa], created by @userquin.

### Usage 🚀

See the [_PWA guide_][pwa] for more information.

```ts
// iles.config.ts
import { defineConfig } from 'iles'
import pwa from '@islands/pwa'

export default defineConfig({
  modules: [
    pwa(options),
  ],
})
```
