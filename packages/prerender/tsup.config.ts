import type { Options } from 'tsup'
export const tsup: Options = {
  dts: true,
  target: 'es2020',
  format: ['esm', 'cjs'],
  external: [
    'vue',
    'preact',
    '@islands/hydration/preact',
    '@islands/hydration/svelte/island',
    'preact-render-to-string',
    'solid-js',
    'solid-js/web',
    'solid-js/web/dist/web.js',
    'solid-js/web/dist/server.js',
    'svelte',
    'svelte/internal',
  ],
}
