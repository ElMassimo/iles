import type { Options } from 'tsup'
export const tsup: Options = {
  clean: true,
  dts: true,
  target: 'node14',
  splitting: true,
  format: ['esm'],
}
