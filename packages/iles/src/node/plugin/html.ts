// Inspired by Vite's html parsing with parse5 https://github.com/vitejs/vite/blob/main/packages/vite/src/node/plugins/html.ts

import { promises as fs } from 'fs'
import { exists } from './utils'
import { resolve } from 'pathe'

import type { AppConfig } from '../shared'
import { ILES_APP_ENTRY } from '../constants'

import type { DefaultTreeAdapterMap, ParserError, Token } from 'parse5'
import type {
  RollupError,
} from 'rollup'

function nodeIsElement (
  node: DefaultTreeAdapterMap['node'],
): node is DefaultTreeAdapterMap['element'] {
  return node.nodeName[0] !== '#'
}

function traverseNodes (
  node: DefaultTreeAdapterMap['node'],
  visitor: (node: DefaultTreeAdapterMap['node']) => void,
) {
  if (node.nodeName === 'template') {
    node = (node as DefaultTreeAdapterMap['template']).content
  }
  visitor(node)
  if (
    nodeIsElement(node)
    || node.nodeName === '#document'
    || node.nodeName === '#document-fragment'
  ) {
    node.childNodes.forEach((childNode) => traverseNodes(childNode, visitor))
  }
}

const splitRE = /\r?\n/g

const range: number = 2

interface Pos {
  /** 1-based */
  line: number
  /** 0-based */
  column: number
}

function posToNumber (source: string, pos: number | Pos): number {
  if (typeof pos === 'number') return pos
  const lines = source.split(splitRE)
  const { line, column } = pos
  let start = 0
  for (let i = 0; i < line - 1 && i < lines.length; i++) {
    start += lines[i].length + 1
  }
  return start + column
}

function generateCodeFrame (
  source: string,
  start: number | Pos = 0,
  end?: number | Pos,
): string {
  start = Math.max(posToNumber(source, start), 0)
  end = Math.min(
    end !== undefined ? posToNumber(source, end) : start,
    source.length,
  )
  const lines = source.split(splitRE)
  let count = 0
  const res: string[] = []
  for (let i = 0; i < lines.length; i++) {
    count += lines[i].length
    if (count >= start) {
      for (let j = i - range; j <= i + range || end > count; j++) {
        if (j < 0 || j >= lines.length) continue
        const line = j + 1
        res.push(
          `${line}${' '.repeat(Math.max(3 - String(line).length, 0))}|  ${lines[j]
          }`,
        )
        const lineLength = lines[j].length
        if (j === i) {
          // push underline
          const pad = Math.max(start - (count - lineLength), 0)
          const length = Math.max(
            1,
            end > count ? lineLength - pad : end - start,
          )
          res.push(`   |  ${' '.repeat(pad)}${'^'.repeat(length)}`)
        }
        else if (j > i) {
          if (end > count) {
            const length = Math.max(Math.min(end - count, lineLength), 1)
            res.push(`   |  ${'^'.repeat(length)}`)
          }
          count += lineLength + 1
        }
      }
      break
    }
    count++
  }
  return res.join('\n')
}

/**
 * Format parse5 @type {ParserError} to @type {RollupError}
 */
function formatParseError (parserError: ParserError, id: string, html: string) {
  const formattedError = {
    code: parserError.code,
    message: `parse5 error code ${parserError.code}`,
    frame: generateCodeFrame(
      html,
      parserError.startOffset,
      parserError.endOffset,
    ),
    loc: {
      file: id,
      line: parserError.startLine,
      column: parserError.startCol,
    },
  } satisfies RollupError
  return formattedError
}

function handleParseError (
  parserError: ParserError,
  html: string,
  filePath: string,
) {
  switch (parserError.code) {
    case 'missing-doctype':
      // ignore missing DOCTYPE
      return
    case 'abandoned-head-element-child':
      // Accept elements without closing tag in <head>
      return
    case 'duplicate-attribute':
      // Accept duplicate attributes #5966
      // The first attribute is used, browsers silently ignore duplicates
      return
    case 'non-void-html-element-start-tag-with-trailing-solidus':
      // Allow self closing on non-void elements #10439
      return
    case 'unexpected-question-mark-instead-of-tag-name':
      // Allow <?xml> declaration and <?> empty elements
      // lit generates <?>: https://github.com/lit/lit/issues/2470
      return
  }
  const parseError = formatParseError(parserError, filePath, html)
  throw new Error(
    `Unable to parse HTML; ${parseError.message}\n`
    + ` at ${parseError.loc.file}:${parseError.loc.line}:${parseError.loc.column}\n`
    + `${parseError.frame}`,
  )
}

async function traverseHtml (
  html: string,
  filePath: string,
  visitor: (node: DefaultTreeAdapterMap['node']) => void,
): Promise<void> {
  // lazy load compiler
  const { parse } = await import('parse5')
  const ast = parse(html, {
    scriptingEnabled: false, // parse inside <noscript>
    sourceCodeLocationInfo: true,
    onParseError: (e: ParserError) => {
      handleParseError(e, html, filePath)
    },
  })
  traverseNodes(ast, visitor)
}

function getScriptInfo (node: DefaultTreeAdapterMap['element']): {
  src: Token.Attribute | undefined
  srcSourceCodeLocation: Token.Location | undefined
  isModule: boolean
  isAsync: boolean
  isIgnored: boolean
} {
  let src: Token.Attribute | undefined
  let srcSourceCodeLocation: Token.Location | undefined
  let isModule = false
  let isAsync = false
  let isIgnored = false
  for (const p of node.attrs) {
    if (p.prefix !== undefined) continue
    if (p.name === 'src') {
      if (!src) {
        src = p
        srcSourceCodeLocation = node.sourceCodeLocation?.attrs!.src
      }
    }
    else if (p.name === 'type' && p.value && p.value === 'module') {
      isModule = true
    }
    else if (p.name === 'async') {
      isAsync = true
    }
    else if (p.name === 'vite-ignore') {
      isIgnored = true
    }
  }
  return { src, srcSourceCodeLocation, isModule, isAsync, isIgnored }
}

interface HtmlTagDescriptor {
  tag: string
  attrs?: Record<string, string | boolean | undefined>
  children?: string | HtmlTagDescriptor[]
  /**
   * default: 'head-prepend'
   */
  injectTo?: 'head' | 'body' | 'head-prepend' | 'body-prepend'
}

const unaryTags = new Set(['link', 'meta', 'base'])

function serializeTag (
  { tag, attrs, children }: HtmlTagDescriptor,
  indent: string = '',
): string {
  if (unaryTags.has(tag)) {
    return `<${tag}${serializeAttrs(attrs)}>`
  }
  else {
    return `<${tag}${serializeAttrs(attrs)}>${serializeTags(
      children,
      incrementIndent(indent),
    )}</${tag}>`
  }
}

function serializeTags (
  tags: HtmlTagDescriptor['children'],
  indent: string = '',
): string {
  if (typeof tags === 'string') {
    return tags
  }
  else if (tags && tags.length) {
    return tags.map((tag) => `${indent}${serializeTag(tag, indent)}\n`).join('')
  }
  return ''
}

const escapeHtmlReplaceMap = {
  '&': '&amp;',
  '\'': '&#x27;',
  '`': '&#x60;',
  '"': '&quot;',
  '<': '&lt;',
  '>': '&gt;',
}

function escapeHtml (string: string | undefined): string {
  // @ts-ignore
  return string.replace(/[&'`"<>]/g, (match) => escapeHtmlReplaceMap[match])
}


function serializeAttrs (attrs: HtmlTagDescriptor['attrs']): string {
  let res = ''
  for (const key in attrs) {
    if (typeof attrs[key] === 'boolean') {
      res += attrs[key] ? ` ${key}` : ``
    }
    else {
      res += ` ${key}="${escapeHtml(attrs[key])}"`
    }
  }
  return res
}

function incrementIndent (indent: string = '') {
  return `${indent}${indent[0] === '\t' ? '\t' : '  '}`
}

// User provided index.html
export async function getUserShell (config: AppConfig, html: string = ''): Promise<{
  userShellPath: string
  userShell: string
  isValidUserShell: boolean
  errorMsgUserShell: string
}> {

  const userShellPath = resolve(config.root, 'index.html')

  let userShell = html

  let ilesDevShellExists = false; let divAppForShell = false

  if (!userShell) {
    if (await exists(userShellPath)) {
      userShell = await fs.readFile(userShellPath, 'utf-8')
    }
    else {
      userShell = `<!DOCTYPE html>
<html>
  <head>
  </head>
  <body>
    <div id="app"></div>
  </body>
</html>`
    }
  }

  await traverseHtml(userShell, userShellPath, (node) => {
    if (!nodeIsElement(node)) {
      return
    }

    // script tags
    if (node.nodeName === 'script') {
      const { src } = getScriptInfo(node)
      if (src?.value === ILES_APP_ENTRY) {
        ilesDevShellExists = true
      }
    }

    if (node.nodeName === 'div') {
      const nonTextCommentChildNodes = node.childNodes.filter(node => node.nodeName !== '#text' && node.nodeName !== '#comment')
      if (!nonTextCommentChildNodes.length) {
        for (const attr of node.attrs) {
          if (attr.name === 'id' && attr.value === 'app') {
            divAppForShell = true
            break;
          }
        }
      }
    }
  })

  let errorMsgUserShell = ''; let isValidUserShell = true

  if (!ilesDevShellExists) {
    // Inject iles dev shell if it doesn't exist
    const ilesDevShell = '<script type="module" src="/@iles-entry"></script>';
    const bodyCloseTag = '</body>';
    return await getUserShell(config, userShell.replace(bodyCloseTag, `${ilesDevShell}\n${bodyCloseTag}`))
  }

  if (!divAppForShell) {
    errorMsgUserShell = `[îles] index.html doesn't contain an div#app placeholder to load shell. Add <div id="app"></div> inside body.`
    isValidUserShell = false
  }

  if (!isValidUserShell) {
    throw new Error(errorMsgUserShell)
  }

  return {
    userShellPath,
    userShell,
    isValidUserShell,
    errorMsgUserShell,
  }
}
