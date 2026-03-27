import { defineConfig } from 'vite-plus/pack'

export default defineConfig({
  entry: ['src/prism.ts'],
  target: 'node20',
  deps: {
    onlyBundle: [],
  },
})
