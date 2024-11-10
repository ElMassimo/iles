import type { Options } from 'tsup'
export const tsup: Options = {
  clean: true,
  dts: true,
  target: 'node20',
  format: ['esm', 'cjs'],
}
