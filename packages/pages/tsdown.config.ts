import { defineConfig } from 'vite-plus/pack'

export default defineConfig({
  entry: ['src/pages.ts'],
  target: 'node20',
  dts: true,
  deps: {
    // oNlybundle: [],
  },
})
