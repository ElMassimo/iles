import type { Options } from 'tsup'
export const tsup: Options = {
  dts: true,
  target: 'es2020',
  splitting: true,
  format: ['esm'],
  external: [
    'vue',
    'preact',
    'preact-render-to-string',
    'solid-js',
    '@islands/hydration/svelte/island',
    'solid-js/web',
    'solid-js/web/dist/web.js',
    'solid-js/web/dist/server.js',
    'svelte',
    'svelte/internal',
  ],
}
