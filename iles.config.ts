import { defineConfig } from 'iles'

// NOTE: This config is used when running tests.
export default defineConfig({
  siteUrl: 'https://example.com/',
  vite: {
    resolve: {
      alias: {
        '@components/': `${__dirname}/packages/iles/src/client/app/components/`,
        '@node/': `${__dirname}/packages/iles/src/node/`,
      },
    },
  },
})
