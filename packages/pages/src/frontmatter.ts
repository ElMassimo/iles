import { promises as fs } from 'fs'
import { extname } from 'pathe'
import grayMatter from 'gray-matter'
import type { RouteRecordRaw } from 'vue-router'
import { parse as parseSFC } from 'vue/compiler-sfc'

export async function parsePageMatter (filename: string, content: string): Frontmatter {
  const content = await fs.readFile(filename, 'utf8')

  const matter = extname(filename) === '.vue'
    ? await parsePageBlock(filename, content)
    : parseFrontmatter(filename, content)

  if (!matter) return

  let { layout, meta: rawMeta, route, ...frontmatter } = matter

  // Users can explicitly provide route to avoid unwanted behavior.
  if (!route) {
    const { name, path, redirect, alias } = matter
    route = clearUndefined({ name, path, redirect, alias })
  }

  // Skip layout for non-HTML files, such as RSS feeds.
  if (layout === undefined) {
    const ext = extname(route.path) || '.html'
    layout = ext !== '.html' ? false : 'default'
  }

  const meta = { filename, href: route.path!, ...rawMeta }

  return { layout, meta, route: route as any, frontmatter }
}

function parseFrontmatter (filename: string, content: string, language?: string) {
  try {
    return grayMatter(content, { language, engines }).data
  }
  catch (err: any) {
    err.message = `Invalid frontmatter for ${filename}\n${err.message}`
    throw err
  }
}

export async function parsePageBlock (filename: string, content: string, options: ResolvedOptions) {
  const parsed = await parseSFC(content, { pad: 'space' }).descriptor
  const layoutAttrs = parsed.template?.attrs
  const block = parsed.customBlocks.find(block => block.type === 'page')

  if (!block)
    return layoutAttrs

  const markdown = `---\n${block.content}\n---`
  return { ...layoutAttrs, ...parseFrontmatter(filename, markdown, block.lang) }
}

/**
 * Clear undefined fields from an object. It mutates the object
 */
export function clearUndefined<T extends object> (obj: T): T {
  // @ts-expect-error
  Object.keys(obj).forEach((key: string) => (obj[key] === undefined ? delete obj[key] : {}))
  return obj
}
