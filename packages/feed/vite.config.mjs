import { defineConfig } from 'vite-plus'

export default defineConfig({
  lint: {
    options: {
      typeAware: true,
      typeCheck: true,
    },
  },
  pack: {
    entry: ['src/types.ts', 'src/feed.ts', 'src/render-feed.ts'],
    target: 'node20',
    dts: true,
    deps: {
      onlyBundle: [],
    },
  },
})
