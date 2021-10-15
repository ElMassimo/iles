import type { Options } from 'tsup'
export const tsup: Options = {
  dts: true,
  target: 'es2020',
  splitting: true,
  format: ['esm', 'cjs'],
  external: [
    'vue',
    'preact',
    'preact-render-to-string',
    'solid-js',
    'solid-js/web/dist/web.js',
    'svelte',
    'svelte/internal',
  ],
}
