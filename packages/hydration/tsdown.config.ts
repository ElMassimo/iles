import { defineConfig } from 'vite-plus/pack'

export default defineConfig({
  entry: ['hydration.ts', 'preact.ts', 'vue.ts', 'vanilla.ts', 'solid.ts', 'svelte.ts'],
  platform: 'browser',
  dts: true,
  deps: {
    // oNlybundle: [],
  },
})
