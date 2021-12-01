import type { Pluggable, Plugin } from 'unified'
import type { ExpressionStatement } from 'estree'
import type { Data, Parent } from 'unist'
import type { IlesModule } from 'iles'
import type { MDXFlowExpression } from 'mdast-util-mdx-expression'
import type { Root } from 'mdast'
import type { Grammar } from 'prismjs'

import prism from 'prismjs'
import loadLanguages from 'prismjs/components/index.js'
import { visit, SKIP } from 'unist-util-visit'

const defaultLanguageShortcuts: Record<string, string> = {
  vue: 'markup',
  html: 'markup',
  md: 'markdown',
  mdx: 'markdown',
  ts: 'typescript',
  py: 'python',
  sh: 'bash',
}

export interface PrismOptions {
  alias?: Record<string, string>
  showLineNumbers?: boolean
}

/**
 * An iles module that injects a remark plugin to to provide syntax highlighting.
 */
export default function IlesPrism (options?: PrismOptions): IlesModule {
  return {
    name: '@islands/prism',
    markdown: {
      remarkPlugins: [
        [remarkPlugin, options],
      ],
    },
  }
}

/**
 * A remark plugin to provide syntax highlighting for code blocks, supporting
 * line numbers and line highlighting.
 *
 * @param options - Options to configure PrismJS.
 */
const remarkPlugin: Plugin<[PrismOptions], Root> = function RemarkPrismPlugin (options: PrismOptions = {}) {
  const languageShortcuts = { ...defaultLanguageShortcuts, ...options.alias }

  return (ast) => {
    visit(ast, 'code', (node, index, parent) => {
      const lang = node.lang || 'text'
      const grammar = languageGrammarFor(languageShortcuts[lang] || lang)
      if (grammar) {
        const codeHtml = highlightCode(node.value, grammar, lang, node.meta || '', options)
        parent!.children[index!] = toRawExpression(codeHtml, lang)
      }
      return SKIP
    })
  }
}

function highlightCode (code: string, grammar: Grammar, lang: string, meta: string, options: PrismOptions) {
  code = prism.highlight(code, grammar, lang)

  const highlightLine = extractLineNumbers(meta)
  const showLineNumbers = (options.showLineNumbers && !meta.includes('hideLineNumbers')) || meta.includes('showLineNumbers')
  const lines = showLineNumbers || highlightLine ? code.split('\n') : []

  const classes = [
    `language-${lang}`,
    showLineNumbers && 'line-numbers-mode',
  ].filter(x => x).join(' ')

  const innerHtml = [
    highlightLine && `<pre class="line-highlight">${highlightLines(lines, highlightLine)}</pre>`,
    `<pre class="language-${lang}"><code>${code}</code></pre>`,
    showLineNumbers && `<pre class="line-numbers">${addLineNumbers(lines)}</pre>`,
  ].filter(x => x).join('')

  return `<div class="${classes}" data-lang="${lang === 'text' ? '' : lang}">${innerHtml}</div>`
}

function highlightLines (lines: string[], highlighted: (line: number) => boolean) {
  return lines
    .map((_, index) => highlighted(index + 1) ? '<div class="highlighted">&nbsp;</div>' : '<br>')
    .join('')
}

function addLineNumbers (lines: string[]) {
  return lines
    .map((_, index) => `<span class="line-number">${index + 1}</span><br>`)
    .join('')
}

function extractLineNumbers (meta: string) {
  const rangesStr = meta.match(/\{(.*?)\}/)?.[1]
  if (rangesStr) {
    const ranges = rangesStr.split(',').map((v) => v.split('-').map((v) => parseInt(v, 10)))
    return (line: number) =>
      ranges.some(([start, end]) => end ? line >= start && line <= end : line === start)
  }
}

function languageGrammarFor (lang: string): undefined | Grammar {
  if (!prism.languages[lang]) {
    try {
      loadLanguages([lang])
    }
    catch (e) {
      console.warn(`[prismjs] Syntax highlight for language "${lang}" is not supported.`)
    }
  }
  return prism.languages[lang]
}

// Internal: Returns an MDX expression to render raw HTML with the highlighted code.
function toRawExpression (rawHTML: string, lang: string): MDXFlowExpression {
  const rawExpression: ExpressionStatement = {
    type: 'ExpressionStatement',
    expression: {
      type: 'CallExpression',
      callee: { type: 'Identifier', name: '_raw' },
      arguments: [
        { type: 'Literal', value: rawHTML, raw: JSON.stringify(rawHTML) },
        { type: 'Literal', value: 1, raw: '1' },
      ],
      optional: false,
    },
  }
  return {
    type: 'mdxFlowExpression',
    value: '_not_used_',
    data: { estree: { type: 'Program', sourceType: 'module', body: [rawExpression] } },
  }
}
