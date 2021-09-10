import path from 'path'
import fs from 'fs-extra'
import { SiteConfig, resolveSiteDataByRoute } from '../config'
import { HeadConfig } from '../shared'
import { normalizePath } from 'vite'
import { RollupOutput, OutputChunk, OutputAsset } from 'rollup'

const escape = require('escape-html')

export async function renderPage(
  config: SiteConfig,
  page: string, // foo.md
  result: RollupOutput,
  appChunk: OutputChunk,
  cssChunk: OutputAsset,
  pageToHashMap: Record<string, string>,
  hashMapString: string
) {
  const { createApp } = require(path.join(config.tempDir, `app.js`))
  const { app, router } = createApp()
  const routePath = `/${page.replace(/\.md$/, '')}`
  const siteData = resolveSiteDataByRoute(config.site, routePath)
  router.go(routePath)
  // lazy require server-renderer for production build
  const content = await require('@vue/server-renderer').renderToString(app)

  const pageName = page.replace(/\//g, '_')
  // server build doesn't need hash
  const pageServerJsFileName = pageName + '.js'
  // for any initial page load, we only need the lean version of the page js
  // since the static content is already on the page!
  const pageHash = pageToHashMap[pageName.toLowerCase()]
  const pageClientJsFileName = `assets/${pageName}.${pageHash}.lean.js`

  // resolve page data so we can render head tags
  const { __pageData } = require(path.join(
    config.tempDir,
    pageServerJsFileName
  ))
  const pageData = JSON.parse(__pageData)

  const preloadLinks = [
    // resolve imports for index.js + page.md.js and inject script tags for
    // them as well so we fetch everything as early as possible without having
    // to wait for entry chunks to parse
    ...resolvePageImports(config, page, result, appChunk),
    pageClientJsFileName,
    appChunk.fileName
  ]
    .map((file) => {
      return `<link rel="modulepreload" href="${siteData.base}${file}">`
    })
    .join('\n    ')

  const stylesheetLink = cssChunk
    ? `<link rel="stylesheet" href="${siteData.base}${cssChunk.fileName}">`
    : ''

  const title: string =
    pageData.title && pageData.title !== 'Home'
      ? `${pageData.title} | ${siteData.title}`
      : siteData.title

  const head = addSocialTags(
    title,
    ...siteData.head,
    ...filterOutHeadDescription(pageData.frontmatter.head)
  )

  const html = `
<!DOCTYPE html>
<html lang="${siteData.lang}">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <title>${title}</title>
    <meta name="description" content="${
      pageData.description || siteData.description
    }">
    ${stylesheetLink}
    ${preloadLinks}
    ${renderHead(head)}
  </head>
  <body>
    <div id="app">${content}</div>
    <script>__VP_HASH_MAP__ = JSON.parse(${hashMapString})</script>
    <script type="module" async src="${siteData.base}${
    appChunk.fileName
  }"></script>
  </body>
</html>`.trim()
  const htmlFileName = path.join(config.outDir, page.replace(/\.md$/, '.html'))
  await fs.ensureDir(path.dirname(htmlFileName))
  await fs.writeFile(htmlFileName, html)
}

function resolvePageImports(
  config: SiteConfig,
  page: string,
  result: RollupOutput,
  indexChunk: OutputChunk
) {
  // find the page's js chunk and inject script tags for its imports so that
  // they are start fetching as early as possible
  const srcPath = normalizePath(
    fs.realpathSync(path.resolve(config.srcDir, page))
  )
  const pageChunk = result.output.find(
    (chunk) => chunk.type === 'chunk' && chunk.facadeModuleId === srcPath
  ) as OutputChunk
  return Array.from(
    new Set([
      ...indexChunk.imports,
      ...indexChunk.dynamicImports,
      ...pageChunk.imports,
      ...pageChunk.dynamicImports
    ])
  )
}

function renderHead(head: HeadConfig[]) {
  return head
    .map(([tag, attrs = {}, innerHTML = '']) => {
      const openTag = `<${tag}${renderAttrs(attrs)}>`
      if (tag !== 'link' && tag !== 'meta') {
        return `${openTag}${innerHTML}</${tag}>`
      } else {
        return openTag
      }
    })
    .join('\n    ')
}

function renderAttrs(attrs: Record<string, string>): string {
  return Object.keys(attrs)
    .map((key) => {
      return ` ${key}="${escape(attrs[key])}"`
    })
    .join('')
}

function isMetaDescription(headConfig: HeadConfig) {
  const [type, attrs] = headConfig
  return type === 'meta' && attrs?.name === 'description'
}

function filterOutHeadDescription(head: HeadConfig[] | undefined) {
  return head ? head.filter((h) => !isMetaDescription(h)) : []
}

function hasTag(head: HeadConfig[], tag: HeadConfig) {
  const [tagType, tagAttrs] = tag
  const [attr, value] = Object.entries(tagAttrs)[0] // First key
  return head.some(([type, attrs]) => type === tagType && attrs[attr] === value)
}

function addSocialTags(title: string, ...head: HeadConfig[]) {
  const tags: HeadConfig[] = [
    ['meta', { name: 'twitter:title', content: title }],
    ['meta', { property: 'og:title', content: title }]
  ]
  tags.filter((tagAttrs) => {
    if (!hasTag(head, tagAttrs)) head.push(tagAttrs)
  })
  return head
}
