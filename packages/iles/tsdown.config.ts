import { defineConfig } from 'vite-plus/pack'

export default defineConfig({
  entry: ['src/node/index.ts', 'src/node/cli.ts'],
  target: 'node20',
  lint: {
    typeAware: true,
    typeCheck: true,
  },
  outDir: 'dist/node',
})
