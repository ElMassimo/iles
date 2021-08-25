import { resolve } from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import jsx from '@vitejs/plugin-vue-jsx'
import xdm from 'xdm/rollup.js'
import components from 'vite-plugin-components/dist/index.mjs'
import inspect from 'vite-plugin-inspect/dist/index.mjs'

import { remarkMdxImages } from 'remark-mdx-images'
import remarkFrontmatter from 'remark-frontmatter';
import { remarkMdxFrontmatter } from 'remark-mdx-frontmatter';

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '~/': `${resolve(__dirname, 'src')}/`
    },
  },
  plugins: [
    components({
      customLoaderMatcher: path => path.endsWith('.mdx'),
      dirs: ['src/components', 'pages'],
      extensions: ['vue', 'mdx', 'jsx'],
    }),
    inspect(),
    xdm({
      jsx: true,
      remarkPlugins: [
        remarkFrontmatter,
        remarkMdxFrontmatter,
        remarkMdxImages,
      ],
    }),
    vue(),
    {
      name: 'mdx-transform',
      transform (code, id) {
        if (!id.endsWith('.mdx')) return null
        return code.replace('export default MDXContent', `
          ${code.includes('defineComponent') ? '' : "import { defineComponent } from 'vue'"}

          export default defineComponent({ render: MDXContent })
        `)
      },
    },
    jsx({
      include: /\.[jt]sx|mdx$/
    }),
  ]
})
