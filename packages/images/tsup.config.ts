import type { Options } from 'tsup'

export const tsup: Options = {
  clean: true,
  dts: true,
  target: 'node18',
  format: ['esm', 'cjs'],
}
