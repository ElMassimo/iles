import { defineConfig } from 'iles'
import { join } from 'pathe'

const testConfig = {
  test: {
    deps: {
      inline: [
        "@vue/devtools-api",
      ],
    },
  },
}

// NOTE: This config is used when running tests.
export default defineConfig({
  siteUrl: 'https://example.com/',
  pagesDir: join(__dirname, 'playground/the-vue-point/src/pages'),
  vite: {
    resolve: {
      alias: {
        'iles/jsx-runtime': `${__dirname}/packages/iles/jsx-runtime.js`,
        'iles/turbo': `${__dirname}/packages/iles/turbo.js`,
        'iles': `${__dirname}/packages/iles/src/client/index.ts`,
        '@components/': `${__dirname}/packages/iles/src/client/app/components/`,
        '@node/': `${__dirname}/packages/iles/src/node/`,
        '@mdx/': `${__dirname}/packages/mdx/src/`,
        '@pages/': `${__dirname}/playground/the-vue-point/src/pages/`,
      },
    },
    ...(testConfig as any),
  },
})
