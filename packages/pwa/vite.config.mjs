import { defineConfig } from 'vite-plus'

export default defineConfig({
  lint: {
    options: {
      typeAware: true,
      typeCheck: true,
    },
  },
  pack: {
    entry: ['src/pwa.ts'],
    target: 'node20',
    dts: true,
    deps: {
      onlyBundle: [],
    },
  },
})
