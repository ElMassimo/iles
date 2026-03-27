import { defineConfig } from 'vite-plus'

export default defineConfig({
  lint: {
    options: {
      typeAware: true,
      typeCheck: true,
    },
  },
  pack: {
    entry: ['src/prism.ts'],
    target: 'node20',
    dts: true,
    deps: {
      onlyBundle: [],
    },
  },
})
