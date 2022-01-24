import { defineConfig } from 'iles'
import { join } from 'pathe'

// NOTE: This config is used when running tests.
export default defineConfig({
  siteUrl: 'https://example.com/',
  pagesDir: join(__dirname, 'playground/the-vue-point/src/pages'),
  vite: {
    resolve: {
      alias: {
        '@components/': `${__dirname}/packages/iles/src/client/app/components/`,
        '@node/': `${__dirname}/packages/iles/src/node/`,
        '@mdx/': `${__dirname}/packages/mdx/src/`,
        '@pages/': `${__dirname}/playground/the-vue-point/src/pages/`,
      },
    },
  },
})
