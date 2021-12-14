import { defineConfig } from 'iles'

// NOTE: This config is used when running tests.
export default defineConfig({
  siteUrl: 'https://example.com/',
  vite: {
    resolve: {
      alias: {
        '@node/': `${__dirname}/packages/iles/src/node/`,
      },
    },
  },
})
