/* eslint-disable @typescript-eslint/no-var-requires */
import { join } from 'pathe'
import { renderHeadToString } from '@vueuse/head'
import type { RollupOutput } from 'rollup'
import { renderers } from '@islands/prerender'
import { IslandDefinition } from 'iles'
import type { Awaited, AppConfig, CreateAppFactory, IslandsByPath, RouteToRender } from '../shared'
import type { bundle } from './bundle'
import { getRoutesToRender } from './routes'

const commentsRegex = /<!--\[-->|<!--]-->|<!---->/g

export async function renderPages (
  config: AppConfig,
  islandsByPath: IslandsByPath,
  { clientResult }: Awaited<ReturnType<typeof bundle>>,
) {
  // NOTE: Polyfill fetch for isomorphic rendering.
  if (!globalThis.fetch)
    // @ts-ignore
    globalThis.fetch = require('node-fetch')

  const { createApp }: { createApp: CreateAppFactory} = require(join(config.tempDir, 'app.js'))

  const routesToRender = await getRoutesToRender(config, createApp)

  const clientChunks = clientResult.output

  for (const route of routesToRender)
    route.rendered = await renderPage(config, islandsByPath, clientChunks, route, createApp)

  return { routesToRender }
}

export async function renderPage (
  config: AppConfig,
  islandsByPath: IslandsByPath,
  clientChunks: RollupOutput['output'],
  route: RouteToRender,
  createApp: CreateAppFactory,
) {
  const { app, head } = await createApp({ routePath: route.path })
  const content = await require('@vue/server-renderer').renderToString(app, { islandsByPath, renderers })

  // Remove comments from Vue renderer to allow plain text, RSS, or JSON output.
  if (!route.outputFilename.endsWith('.html'))
    return content.replace(commentsRegex, '')

  const { headTags, htmlAttrs, bodyAttrs } = renderHeadToString(head)

  return `
<!DOCTYPE html>
<html ${htmlAttrs}>
  <head>
    ${headTags}
    ${stylesheetTagsFrom(config, clientChunks)}
    ${await scriptTagsFrom(config, islandsByPath[route.path])}
  </head>
  <body ${bodyAttrs}>
    <div id="app">${content}</div>
  </body>
</html>`.trim()
}

function stylesheetTagsFrom (config: AppConfig, clientChunks: RollupOutput['output']) {
  return clientChunks
    .filter(chunk => chunk.type === 'asset' && chunk.fileName.endsWith('.css'))
    .map(chunk => `<link rel="stylesheet" href="${config.base}${chunk.fileName}">`)
    .join('\n')
}

async function scriptTagsFrom (config: AppConfig, islands: undefined | IslandDefinition[]) {
  const anySolid = islands?.some(island => island.script.includes('@islands/hydration/solid'))
  if (!anySolid) return ''
  return '<script>window._$HYDRATION={events:[],completed:new WeakSet()}</script>'
}
