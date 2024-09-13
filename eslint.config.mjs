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
    markdown: false,
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
      'vue/html-closing-bracket-spacing': ['warn', {
        selfClosingTag: 'never',
      }],
      'vue/multiline-html-element-content-newline': 'off',
      'vue/html-self-closing': 'off',
      'vue/valid-v-for': 'off',

      // 'style/arrow-parens': ['error', 'always'],
      // 'style/space-before-function-paren': ['error', 'always'],

      // Consider enabling at some point.
      'format/prettier': 'off',
      'ts/consistent-type-imports': 'off',
      'unused-imports/no-unused-imports': 'off',
      'no-undef': 'off',
      'unicorn/prefer-node-protocol': 'off',
      'curly': 'off',
      'test/consistent-test-it': 'off',
      'antfu/consistent-list-newline': 'off',
      'import/newline-after-import': 'off',
      'import/no-duplicates': 'off',
      'import/order': 'off',
      'jsonc/sort-array-values': 'off',
      'jsonc/sort-keys': 'off',
      'regexp/confusing-quantifier': 'off',
      'regexp/match-any': 'off',
      'regexp/no-contradiction-with-assertion': 'off',
      'regexp/no-dupe-characters-character-class': 'off',
      'regexp/no-super-linear-backtracking': 'off',
      'regexp/no-trivially-nested-quantifier': 'off',
      'regexp/no-unused-capturing-group': 'off',
      'regexp/no-useless-assertions': 'off',
      'regexp/no-useless-flag': 'off',
      'regexp/no-useless-non-capturing-group': 'off',
      'regexp/prefer-w': 'off',
      'regexp/sort-flags': 'off',
      'regexp/strict': 'off',
      'sort-imports': 'off',
      'style/arrow-parens': 'off',
      'style/comma-dangle': 'off',
      'style/indent-binary-ops': 'off',
      'style/member-delimiter-style': 'off',
      'style/object-curly-spacing': 'off',
      'style/semi': 'off',
      'style/space-before-blocks': 'off',
      'style/space-before-function-paren': 'off',
      'style/type-generic-spacing': 'off',
      'vue/no-reserved-component-names': 'off',
      'vue/singleline-html-element-content-newline': 'off',
      'ts/ban-ts-comment': 'off',
      'no-restricted-globals': 'off',
      'ts/no-unsafe-function-type': 'off',
      'yaml/plain-scalar': 'off',
      'yaml/quotes': 'off',
      'style/no-trailing-spaces': 'off',
      'style/no-multiple-empty-lines': 'off',
      'prefer-regex-literals': 'off',
      'unicorn/prefer-number-properties': 'off',
      'style/multiline-ternary': 'off',
      'style/jsx-wrap-multilines': 'off',
      'style/jsx-curly-spacing': 'off',
      'style/quote-props': 'off',
      'node/no-path-concat': 'off',
      'svelte/html-quotes': 'off',
      'svelte/indent': 'off',
      'style/jsx-one-expression-per-line': 'off',
      'solid/no-destructure': 'off',
      'vue/prefer-template': 'off',
      'style/padded-block': 'off',
      'style/type-annotation-spacing': 'off',
      'style/no-multi-spaces': 'off',
      'style/padded-blocks': 'off',
      'ts/no-use-before-define': 'off',
      'ts/no-unused-expressions': 'off',
      'jsdoc/check-param-names': 'off',
      'toml/indent': 'off',
      'toml/tables-order': 'off',
      'vue/block-tag-newline': 'off',
      'regexp/no-useless-lazy': 'off',
      'style/eol-last': 'off',
    },
  },
)
