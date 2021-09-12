/* eslint-disable @typescript-eslint/no-var-requires */
import path from 'path'
import fs from 'fs-extra'
import { RollupOutput, OutputChunk, OutputAsset } from 'rollup'
import type { ResolvedPage } from 'vite-plugin-pages'
import { renderHeadToString } from '@vueuse/head'
import { AppConfig } from '../config'
import { CreateAppFactory, IslandDefinition, SSGContext } from '../shared'

export async function renderPage (
  config: AppConfig,
  page: ResolvedPage, // foo.md
  result: RollupOutput,
  appChunk: OutputChunk,
  cssChunk: OutputAsset,
  islandsByPage: Record<string, IslandDefinition[]>,
) {
  const { createApp }: { createApp: CreateAppFactory} = require(path.join(config.tempDir, 'app.js'))

  const routePath = `/${page.route}`
  console.log(`Rendering ${routePath}`)
  const { app, head } = await createApp({ routePath }) as SSGContext
  // lazy require server-renderer for production build
  const content = await require('@vue/server-renderer').renderToString(app, { islandsByPage })

  const preloadLinks = [
    // resolve imports for index.js + page.md.js and inject script tags for
    // them as well so we fetch everything as early as possible without having
    // to wait for entry chunks to parse
    ...resolvePageImports(config, page, result, appChunk),
    appChunk.fileName,
  ]
    .map((file) => {
      return `<link rel="modulepreload" href="${config.base}${file}">`
    })
    .join('\n    ')

  const stylesheetLink = cssChunk
    ? `<link rel="stylesheet" href="${config.base}${cssChunk.fileName}">`
    : ''

  const { headTags, htmlAttrs, bodyAttrs } = renderHeadToString(head)

  const html = `
<!DOCTYPE html>
<html ${htmlAttrs}>
  <head>
    ${headTags}
    ${stylesheetLink}
    ${preloadLinks}
  </head>
  <body ${bodyAttrs}>
    <div id="app">${content}</div>
  </body>
</html>`.trim()
  const htmlFileName = path.join(config.outDir, `${page.route}.html`)
  await fs.ensureDir(path.dirname(htmlFileName))
  await fs.writeFile(htmlFileName, html)
}

function resolvePageImports (
  config: AppConfig,
  page: ResolvedPage,
  result: RollupOutput,
  indexChunk: OutputChunk,
) {
  // find the page's js chunk and inject script tags for its imports so that
  // they are start fetching as early as possible
  const pageChunk = result.output.find(
    chunk => chunk.type === 'chunk' && chunk.facadeModuleId === page.filepath,
  ) as OutputChunk
  return Array.from(
    new Set([
      ...indexChunk.imports,
      ...indexChunk.dynamicImports,
      ...pageChunk.imports,
      ...pageChunk.dynamicImports,
    ]),
  )
}
