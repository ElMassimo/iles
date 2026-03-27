import { defineConfig } from 'vite-plus'

export default defineConfig({
  lint: {
    options: {
      typeAware: true,
      typeCheck: true,
    },
  },
  pack: {
    entry: ['hydration.ts', 'preact.ts', 'vue.ts', 'vanilla.ts', 'solid.ts', 'svelte.ts'],
    platform: 'browser',
    dts: true,
    deps: {
      onlyBundle: [],
    },
  },
})
