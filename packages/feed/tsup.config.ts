import type { Options } from 'tsup'
export const tsup: Options = {
  clean: true,
  dts: true,
  target: 'node20',
  splitting: false,
  format: ['esm'],
}
