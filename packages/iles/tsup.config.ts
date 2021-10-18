import type { Options } from 'tsup'
export const tsup: Options = {
  dts: true,
  target: 'es2020',
  splitting: true,
  sourcemap: false,
  format: ['esm', 'cjs'],
  outDir: 'dist/node',
  external: [
    '@vue/runtime-dom/dist/runtime-dom.esm-bundler.js',
    'solid-js/web',
    '@islands/hydration/dist/hydration.js',
    '@islands/hydration/dist/vue.js',
    '@islands/hydration/dist/vanilla.js',
    '@islands/hydration/dist/solid.js',
    '@islands/hydration/dist/preact.js',
    '@islands/hydration/dist/svelte.js',
  ],
}
