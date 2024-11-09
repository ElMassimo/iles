import type { Options } from 'tsup'
export const tsup: Options = {
  clean: true,
  dts: true,
  target: 'esnext',
  splitting: true,
  format: ['esm'],
  external: [
    'vue',
    'preact',
    'preact-render-to-string',
    'solid-js',
    'solid-js/web',
    'solid-js/web/dist/web.js',
    'solid-js/web/dist/server.js',
    'svelte',
    'svelte/server',
  ],
}
