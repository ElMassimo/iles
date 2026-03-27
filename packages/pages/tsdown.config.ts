import { defineConfig } from 'vite-plus/pack'

export default defineConfig({
  entry: ['src/pages.ts'],
  target: 'node20',
  lint: {
    typeAware: true,
    typeCheck: true,
  },
  dts: true,
  deps: {
    onlyBundle: [],
  },
})
