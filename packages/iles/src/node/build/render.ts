/* eslint-disable @typescript-eslint/no-var-requires */
import { existsSync } from 'fs'
import { join } from 'pathe'
import { renderHeadToString } from '@vueuse/head'
import type { RollupOutput } from 'rollup'
import { renderers } from '@islands/prerender'
import { IslandDefinition } from 'iles'
import { renderToString } from 'vue/server-renderer'
import type { Awaited, AppConfig, CreateAppFactory, IslandsByPath, RouteToRender } from '../shared'
import type { bundle } from './bundle'
import { withSpinner } from './utils'
import { getRoutesToRender } from './routes'

const commentsRegex = /<!--\[-->|<!--]-->|<!---->/g

export async function renderPages (
  config: AppConfig,
  islandsByPath: IslandsByPath,
  { clientResult }: Awaited<ReturnType<typeof bundle>>,
) {
  const appPath = ['js', 'mjs', 'cjs'].map(ext => join(config.tempDir, `app.${ext}`)).find(existsSync)
  if (!appPath)
    throw new Error(`Could not find the SSR build for the app in ${config.tempDir}`)

  const { createApp }: { createApp: CreateAppFactory } = await import(`file://${appPath}`)

  const routesToRender = await withSpinner('resolving static paths', async () =>
    await getRoutesToRender(config, createApp))

  const clientChunks = clientResult.output

  await withSpinner('rendering pages', async () => {
    for (const route of routesToRender)
      route.rendered = await renderPage(config, islandsByPath, clientChunks, route, createApp)
  })

  return { routesToRender }
}

export async function renderPage (
  config: AppConfig,
  islandsByPath: IslandsByPath,
  clientChunks: RollupOutput['output'],
  route: RouteToRender,
  createApp: CreateAppFactory,
) {
  const { app, head } = await createApp({ routePath: route.path, ssrProps: route.ssrProps })
  let content = await renderToString(app, { islandsByPath, renderers })

  // Remove comments from Vue renderer to allow plain text, RSS, or JSON output.
  content = content.replace(commentsRegex, '')

  // Skip HTML shell to allow Vue to render plain text, RSS, or JSON output.
  if (!route.outputFilename.endsWith('.html'))
    return content

  const { headTags, htmlAttrs, bodyTagsOpen, bodyTags, bodyAttrs } = await renderHeadToString(head)

  return `<!DOCTYPE html>
<html ${htmlAttrs}>
  <head>
    ${headTags}
    ${stylesheetTagsFrom(config, clientChunks)}
    ${await scriptTagsFrom(config, islandsByPath[route.path])}
  </head>
  <body ${bodyAttrs}>
    ${bodyTagsOpen}<div id="app">${content}</div>${bodyTags}
  </body>
</html>`
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
  return '<script>window._$HY={events:[],completed:new WeakSet(),r:{}}</script>'
}
