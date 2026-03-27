import { defineConfig } from 'vite-plus/pack'

export default defineConfig({
  entry: ['src/images.ts'],
  target: 'node20',
  dts: true,
  outExtensions: () => ({
    dts: '.d.ts',
  }),
  deps: {
    onlyBundle: [],
  },
})
