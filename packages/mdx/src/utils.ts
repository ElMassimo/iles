import type { Node } from 'unist'
import type { MDXJsxTextElement, MDXJsxFlowElement } from 'mdast-util-mdx-jsx'

const urlPattern = /^(https?:)?\//
const externalUrlPattern = /^(https?:)?\/\//

export function isAbsolute (url: string) {
  return urlPattern.test(url)
}

export function isExternal (url: string) {
  return externalUrlPattern.test(url)
}

export function isJsxElement (node: Node): node is MDXJsxTextElement | MDXJsxFlowElement {
  return node.type === 'mdxJsxTextElement' || node.type === 'mdxJsxFlowElement'
}

export function isString (val: any): val is string {
  return typeof val === 'string'
}

export function toExplicitHtmlPath (path: string) {
  if (isExternal(path) || extname(path) !== '.html') return path
  if (path.endsWith('/')) return path
  if (path.endsWith('/index.html')) return path.replace(/\/index\.html$/, '/')
  return `${path}.html`
}
