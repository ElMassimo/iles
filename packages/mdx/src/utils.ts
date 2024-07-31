import { extname } from 'node:path'
import type { Node } from 'unist'
import type { MdxJsxFlowElement, MdxJsxTextElement } from 'mdast-util-mdx-jsx'

// eslint-disable-next-line regexp/no-unused-capturing-group
const urlPattern = /^(https?:)?\//
// eslint-disable-next-line regexp/no-unused-capturing-group
const externalUrlPattern = /^(https?:)?\/\//

export function isAbsolute(url: string) {
  return urlPattern.test(url)
}

export function isExternal(url: string) {
  return externalUrlPattern.test(url)
}

// eslint-disable-next-line ts/ban-ts-comment
// @ts-ignore
export function isJsxElement(node: Node): node is MdxJsxTextElement | MdxJsxFlowElement {
  return node.type === 'mdxJsxTextElement' || node.type === 'mdxJsxFlowElement'
}

export function isString(val: any): val is string {
  return typeof val === 'string'
}

export function toExplicitHtmlPath(url: string) {
  if (isExternal(url)) { return url }

  let [path, anchor] = url.split('#', 2)
  if (path === '' || path.endsWith('/')) { return url }

  const ext = extname(path)
  if (ext && ext !== '.html') { return url }

  path = path.endsWith('.html') ? path.replace(/\/index\.html$/, '/') : `${path}.html`
  return anchor ? `${path}#${anchor}` : path
}
