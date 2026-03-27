import { defineConfig } from 'vite-plus'

export default defineConfig({
  lint: {
    options: {
      typeAware: true,
      typeCheck: true,
    },
  },
  pack: {
    entry: ['src/node/index.ts', 'src/node/cli.ts'],
    target: 'node20',
    outDir: 'dist/node',
  },
})
