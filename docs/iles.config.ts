import { defineConfig } from 'iles'

import iconsResolver from 'unplugin-icons/resolver'
import { FileSystemIconLoader } from 'unplugin-icons/loaders'

import icons from 'unplugin-icons/vite'
import windicss from 'vite-plugin-windicss'
import inspect from 'vite-plugin-inspect'

import { valueToEstree } from 'estree-util-value-to-estree'
import type { Header } from './src/logic/config'

export default defineConfig({
  debug: 'log',
  siteUrl: 'https://vue-iles.netlify.app',
  components: {
    resolvers: [iconsResolver({ componentPrefix: '', customCollections: ['iles'] })],
  },
  markdown: {
    rehypePlugins: [
      ['@mapbox/rehype-prism', { alias: { markup: ['html', 'vue'] } }],
      () => ({ children }) => {
        const headers: Header[] = []
        children
          .filter(c => c.type === 'element' && c.tagName.length === 2 && c.tagName.startsWith('h') && !c.tagName.endsWith('r'))
          .forEach(c => {
            const title = c.children.filter(c => c.type === 'text').map(c => c.value).join(' ')
            headers.push({ level: Number(c.tagName.slice(1)), title, slug: title.toLowerCase().replace(/\s+/, '-') })
          })
        children.push({
          type: 'mdxjsEsm',
          data: {
            estree: {
              type: 'Program',
              sourceType: 'module',
              body: [
                {
                  type: 'ExpressionStatement',
                  expression: {
                    type: 'AssignmentExpression',
                    operator: '=',
                    left: {
                      type: 'MemberExpression',
                      object: {
                        type: 'Identifier',
                        name: 'meta',
                      },
                      property: {
                        type: 'Identifier',
                        name: 'headers',
                      },
                    },
                    right: valueToEstree(headers),
                  },
                },
              ],
            },
          },
        })
      },
    ],
  },
  vite: {
    resolve: {
      alias: [
        { find: /^react(\/|$)/, replacement: 'preact/compat$1' },
        { find: /^react-dom(\/|$)/, replacement: 'preact/compat$1' },
      ],
    },
    optimizeDeps: {
      include: ['quicklink', '@vueuse/core', '@docsearch/js'],
    },
    plugins: [
      icons({
        autoInstall: true,
        customCollections: {
          iles: FileSystemIconLoader('./images'),
        },
      }),
      windicss(),
      Boolean(process.env.DEBUG) && inspect(),
    ],
  },
})
