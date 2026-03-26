import { defineConfig } from 'vite-plus'

export default defineConfig({
  pack: {
    dts: false,
    deps: {
      onlyBundle: ['slugo'],
    },
  },
})
