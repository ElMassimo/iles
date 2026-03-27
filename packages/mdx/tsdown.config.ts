import { defineConfig } from 'vite-plus/pack'

export default defineConfig({
  entry: ['src/mdx.ts'],
  target: 'node20',
  dts: true,
})
