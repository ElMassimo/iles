import antfu from '@antfu/eslint-config'

// https://github.com/antfu/eslint-config#customization
export default antfu(
  // Configures for antfu's config
  {
    ignores: ['**/dist', 'packages/iles/turbo.js', 'docs/cypress'],
    lessOpinionated: true,
    languageOptions: {
      globals: {
        usePage: 'readonly',
        useRoute: 'readonly',
        useHead: 'readonly',
        definePageComponent: 'readonly',
      },
    },

    // https://github.com/antfu/eslint-config#optional-configs
    jsx: true,
    solid: true,
    svelte: true,
    // unocss: true,
    formatters: {
    /**
     * Format CSS, LESS, SCSS files, also the `<style>` blocks in Vue
     * By default uses Prettier
     */
      css: true,
      /**
       * Format HTML files
       * By default uses Prettier
       */
      html: true,
      /**
       * Format Markdown files
       * Supports Prettier and dprint
       * By default uses Prettier
       */
      markdown: 'prettier',
    },
  },
  {
    // Remember to specify the file glob here, otherwise it might cause the vue plugin to handle non-vue files
    files: ['**/*.vue'],
    rules: {
      'vue/attribute-hyphenation': ['warn', 'never', {
        ignore: ['http-equiv'],
      }],
    },
  },
  {
    // Without `files`, they are general rules for all files
    rules: {
      'prefer-const': 'off',
      'no-unused-vars': 'off',
      'import/named': 'off',
      'import/first': 'off',
      'no-restricted-syntax': 'off',
      'no-use-before-define': 'off',
      'react/react-in-jsx-scope': 'off',
      '@typescript-eslint/no-var-requires': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      'unused-imports/no-unused-vars': 'off',
      'style/max-statements-per-line': 'off',
      'no-console': 'off',
      'node/prefer-global/process': 'off',
      'antfu/no-import-dist': 'off',
    },
  },
)
