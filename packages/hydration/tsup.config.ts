import type { Options } from 'tsup'
export const tsup: Options = {
  dts: true,
  target: 'es2020',
  splitting: true,
  format: ['esm', 'cjs'],
  external: [
    'vue',
    'iles/dist/client/app/composables/devtools',
  ],
}
