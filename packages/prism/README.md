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
  <h3><samp>@islands/prism</samp></h3>
  <img width="2000" height="0">
</p>
</td>
</tbody>
</table>
</p>

[îles]: https://github.com/ElMassimo/iles
[docs]: https://iles-docs.netlify.app
[remark]: https://github.com/remarkjs/remark
[markdown]: https://iles-docs.netlify.app/guide/markdown
[prismjs]: https://prismjs.com/

An [îles] module that injects a [remark] plugin to provide syntax highlighting
for [MDX documents][markdown]:

- 💎 uses [PrismJS] supporting a wide variety of programming languages

- 🔦 highlight specific lines (`{3}`, `{7-13}`, or `{16,23-27,40}`)

- 🔢 display line numbers (`showLineNumbers`)

- 🚀 faster than [`@mapbox/rehype-prism`](https://github.com/mapbox/rehype-prism), [`remark-prism`](https://github.com/sergioramos/remark-prism) and [`rehype-prism-plus`](https://github.com/timlrx/rehype-prism-plus)

### Usage 🚀

Add the module to `iles.config.ts`:

```js
// iles.config.ts
import { defineConfig } from 'iles'

export default defineConfig({
  modules: [
    '@islands/prism',
  ],
})
```

Then, you can highlight lines or display line numbers in code blocks:

````mdx
```js {6} showLineNumbers
// iles.config.ts
import { defineConfig } from 'iles'

export default defineConfig({
  modules: [
    '@islands/prism',
  ],
})
```
````

<img src="https://user-images.githubusercontent.com/1158253/144298425-553b028f-9408-4bd6-a07d-895485ea96de.png#gh-light-mode-only" width="720"/>
<img src="https://user-images.githubusercontent.com/1158253/144298431-7f2fe735-2e2d-49b8-a9d3-da44b5c952ce.png#gh-dark-mode-only" width="720"/>

#### Configuration ⚙️

You can also import the module directly to get autocompletion when providing options:

```ts
// iles.config.ts
import { defineConfig } from 'iles'

import prism from '@islands/prism'

export default defineConfig({
  modules: [
    prism({
      aliases: { zsh: 'bash' },
      showLineNumbers: true,
    }),
  ],
})
```

When `showLineNumbers` is enabled globally, you can use `hideLineNumbers` to
opt-out in a specific code block.

### Styling 🎨

Each code block will be transformed to HTML with the following structure:

```html
<div class="language-js" data-lang="js">
  <pre class="line-highlight">...</pre>
  <pre class="language-ts"><code>...</code></pre>
  <pre class="line-numbers">...</pre>
</div>
```

You can use the following styles to ensure everything _lines up_ as expected:

```css
div[class*='language-'] {
  position: relative;
  /* background, font-size, line-height */
}

div[class*='language-'] pre {
  /* padding */
}

pre[class*='language-'] {
  position: relative; /* position it to allow text selection */
  overflow: auto;
}

pre.line-highlight,
pre.line-numbers {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  margin: 0;
  width: 100%;
  user-select: none;
  overflow: hidden;
}

.line-highlight > .highlighted {
  background: rgba(0,0,0,0.1);
}

div[class*='language-'].line-numbers-mode {
  --gutter-width: 3.5rem;
  padding-left: calc(var(--gutter-width) + 1rem);
}

pre.line-numbers {
  border-right: 1px solid rgba(0,0,0,0.1);
  text-align: center;
  width: var(--gutter-width);
}
```

If you wish to display the language, you can use the value of the `data-lang` attribute by using the [`attr` CSS function](https://developer.mozilla.org/en-US/docs/Web/CSS/attr()):

```css
div[class*='language-']:before {
  content: attr(data-lang);
  color: #888;
  font-size: 0.8rem;
  position: absolute;
  right: 1em;
  top: 0.6em;
}
```
