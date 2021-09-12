/* eslint-disable @typescript-eslint/no-var-requires */
import path from 'path'
import fs from 'fs-extra'
import { RollupOutput, OutputChunk, OutputAsset } from 'rollup'
import { renderHeadToString } from '@vueuse/head'
import { AppConfig } from '../config'
import { CreateAppFactory, IslandDefinition, SSGContext } from '../shared'
import { SSGRoute } from './utils'

export async function renderPage (
  config: AppConfig,
  route: SSGRoute, // foo.md
  result: RollupOutput,
  appChunk: OutputChunk,
  cssChunk: OutputAsset,
  createApp: CreateAppFactory,
  islandsByPage: Record<string, IslandDefinition[]>,
) {
  const { filename, extension, path: routePath, outputFilename } = route

  console.log('Rendering', { filename, routePath, outputFilename })

  const { app, head } = await createApp({ routePath }) as SSGContext
  // lazy require server-renderer for production build
  let content = await require('@vue/server-renderer').renderToString(app, { islandsByPage })

  if (extension === 'html') {
    const preloadLinks = [
      // resolve imports for index.js + page.md.js and inject script tags for
      // them as well so we fetch everything as early as possible without having
      // to wait for entry chunks to parse
      ...resolvePageImports(config, route, result, appChunk),
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

    content = `
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
  }
  const renderedFilename = path.join(config.outDir, outputFilename)
  await fs.ensureDir(path.dirname(renderedFilename))
  await fs.writeFile(renderedFilename, content)
}

function resolvePageImports (
  config: AppConfig,
  page: SSGRoute,
  result: RollupOutput,
  indexChunk: OutputChunk,
) {
  // find the page's js chunk and inject script tags for its imports so that
  // they are start fetching as early as possible
  const pageChunk = result.output.find(
    chunk => chunk.type === 'chunk' && chunk.facadeModuleId === page.filename,
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
