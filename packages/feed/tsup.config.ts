import type { Options } from 'tsup'
export const tsup: Options = {
  dts: true,
  target: 'node14',
  splitting: false,
  format: ['esm'],
}
