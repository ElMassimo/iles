import { defineConfig } from 'vite-plus/pack'

export default defineConfig({
  entry: ['src/pwa.ts'],
  target: 'node20',
  deps: {
    onlyBundle: [],
  },
})
