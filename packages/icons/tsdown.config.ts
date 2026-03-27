import { defineConfig } from 'vite-plus/pack'

export default defineConfig({
  entry: ['src/icons.ts'],
  target: 'node20',
  dts: true,
  deps: {
    onlyBundle: [],
  },
})
