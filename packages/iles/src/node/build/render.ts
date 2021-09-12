/* eslint-disable @typescript-eslint/no-var-requires */
import { RollupOutput } from 'rollup'
import { renderHeadToString } from '@vueuse/head'
import { AppConfig } from '../config'
import { CreateAppFactory, IslandDefinition, SSGContext } from '../shared'
import { SSGRoute } from './utils'

export async function renderPage (
  config: AppConfig,
  route: SSGRoute, // foo.md
  result: RollupOutput,
  createApp: CreateAppFactory,
  islandsByPage: Record<string, IslandDefinition[]>,
) {
  const { extension, path: routePath } = route

  const { app, head } = await createApp({ routePath }) as SSGContext
  // lazy require server-renderer for production build
  let content = await require('@vue/server-renderer').renderToString(app, { islandsByPage })

  if (extension !== 'html') return content

  const cssChunk = result.output.find(chunk =>
    chunk.type === 'asset' && chunk.fileName.endsWith('.css'))
  const stylesheetLink = cssChunk
    ? `<link rel="stylesheet" href="${config.base}${cssChunk.fileName}">`
    : ''

  const { headTags, htmlAttrs, bodyAttrs } = renderHeadToString(head)

  return `
<!DOCTYPE html>
<html ${htmlAttrs}>
  <head>
    ${headTags}
    ${stylesheetLink}
  </head>
  <body ${bodyAttrs}>
    <div id="app">${content}</div>
  </body>
</html>`.trim()
}
