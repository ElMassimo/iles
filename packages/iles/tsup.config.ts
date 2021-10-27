import type { Options } from 'tsup'
export const tsup: Options = {
  dts: true,
  target: 'node14',
  splitting: true,
  sourcemap: false,
  format: ['cjs'],
  outDir: 'dist/node',
  external: [
    '@vue/runtime-dom/dist/runtime-dom.esm-bundler.js',
    'solid-js/web',
    'preact-render-to-string',
    '@islands/hydration/preact',
    '@islands/hydration/dist/hydration.js',
    '@islands/hydration/dist/vue.js',
    '@islands/hydration/dist/vanilla.js',
    '@islands/hydration/dist/solid.js',
    '@islands/hydration/dist/preact.js',
    '@islands/hydration/dist/svelte.js',
  ],
}
