import { defineConfig } from 'vite-plus/pack'

export default defineConfig({
  entry: ['prerender.ts'],
  target: 'node20',
  dts: true,
  deps: {
    onlyBundle: [],
  },
})
