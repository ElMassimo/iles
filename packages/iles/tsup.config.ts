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
    '@islands/hydration/dist/hydration.js',
    '@islands/hydration/dist/vue.js',
    '@islands/hydration/dist/vanilla.js',
  ],
}
