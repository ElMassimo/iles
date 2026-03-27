import { defineConfig } from 'vite-plus/pack'

export default defineConfig({
  entry: ['src/types.ts', 'src/feed.ts', 'src/render-feed.ts'],
  target: 'node20',
  dts: true,
  outExtensions: () => ({
    dts: '.d.ts',
  }),
  deps: {
    onlyBundle: [],
  },
})
