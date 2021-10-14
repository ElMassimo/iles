/* eslint-disable @typescript-eslint/no-var-requires */
import { join } from 'pathe'
import { renderHeadToString } from '@vueuse/head'
import type { RollupOutput } from 'rollup'
import type { Awaited, AppConfig, CreateAppFactory, IslandsByPath, SSGRoute } from '../shared'
import type { bundle } from './bundle'
import { getRoutesForSSG } from './routes'

const commentsRegex = /<!--\[-->|<!--]-->|<!---->/g

export async function renderPages (
  config: AppConfig,
  islandsByPath: IslandsByPath,
  { clientResult }: Awaited<ReturnType<typeof bundle>>,
) {
  const { createApp }: { createApp: CreateAppFactory} = require(join(config.tempDir, 'app.js'))

  const routesToRender = await getRoutesForSSG(config, createApp)

  const clientChunks = clientResult.output

  for (const ssgRoute of routesToRender)
    ssgRoute.rendered = await renderPage(config, islandsByPath, clientChunks, ssgRoute, createApp)

  return { routesToRender }
}

export async function renderPage (
  config: AppConfig,
  islandsByPath: IslandsByPath,
  clientChunks: RollupOutput['output'],
  route: SSGRoute,
  createApp: CreateAppFactory,
) {
  const { app, head } = await createApp({ routePath: route.path })
  const content = await require('@vue/server-renderer').renderToString(app, { islandsByPath })

  if (route.extension !== '.html') return content.replace(commentsRegex, '')

  const { headTags, htmlAttrs, bodyAttrs } = renderHeadToString(head)

  return `
<!DOCTYPE html>
<html ${htmlAttrs}>
  <head>
    ${headTags}
    ${stylesheetTagsFrom(config, clientChunks, route)}
  </head>
  <body ${bodyAttrs}>
    <div id="app">${content}</div>
  </body>
</html>`.trim()
}

function stylesheetTagsFrom (config: AppConfig, clientChunks: RollupOutput['output'], route: SSGRoute) {
  return clientChunks
    .filter(chunk => chunk.type === 'asset' && chunk.fileName.endsWith('.css'))
    .map(chunk => `<link rel="stylesheet" href="${config.base}${chunk.fileName}">`)
    .join('\n')
}
