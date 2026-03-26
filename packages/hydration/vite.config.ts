import { defineConfig } from 'vite-plus'

export default defineConfig({
  pack: {
    deps: {
      onlyBundle: false,
    },
  },
})
