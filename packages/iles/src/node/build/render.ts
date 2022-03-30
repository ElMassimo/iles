/* eslint-disable @typescript-eslint/no-var-requires */
import { join } from 'pathe'
import { renderHeadToString } from '@vueuse/head'
import { renderers } from '@islands/prerender'
import { IslandDefinition } from 'iles'
import type { Awaited, AppConfig, CreateAppFactory, IslandsByPath, RouteToRender } from '../shared'
import { bundle, CssDeps } from './bundle'
import { withSpinner } from './utils'
import { getRoutesToRender } from './routes'

const commentsRegex = /<!--\[-->|<!--]-->|<!---->/g

export async function renderPages (
  config: AppConfig,
  islandsByPath: IslandsByPath,
  { cssDependencies }: Awaited<ReturnType<typeof bundle>>,
) {
  const { createApp }: { createApp: CreateAppFactory} = require(join(config.tempDir, 'app.js'))

  const routesToRender = await withSpinner('resolving static paths', async () =>
    await getRoutesToRender(config, createApp))

  await withSpinner('rendering pages', async () => {
    for (const route of routesToRender)
      route.rendered = await renderPage(config, islandsByPath, cssDependencies, route, createApp)
  })

  return { routesToRender }
}

export async function renderPage (
  config: AppConfig,
  islandsByPath: IslandsByPath,
  cssDependencies: CssDeps,
  route: RouteToRender,
  createApp: CreateAppFactory,
) {
  const { app, head } = await createApp({ routePath: route.path, ssrProps: route.ssrProps })
  let content = await require('@vue/server-renderer').renderToString(app, { islandsByPath, renderers })

  // Remove comments from Vue renderer to allow plain text, RSS, or JSON output.
  content = content.replace(commentsRegex, '')

  // Skip HTML shell to allow Vue to render plain text, RSS, or JSON output.
  if (!route.outputFilename.endsWith('.html'))
    return content

  let { headTags, htmlAttrs, bodyAttrs } = renderHeadToString(head)

  const islands = islandsByPath[route.path] || []
  if (islands.length)
    headTags += `<style>ile-root{display:contents}</style>`

  return `<!DOCTYPE html>
<html ${htmlAttrs}>
  <head>
    ${headTags}
    ${stylesheetTagsFrom(config, cssDependencies[route.path] || [])}
    ${scriptTagsFrom(config, islands)}
  </head>
  <body ${bodyAttrs}>
    <div id="app">${content}</div>
  </body>
</html>`
}

function stylesheetTagsFrom ({ base }: AppConfig, cssFiles: string[]) {
  return cssFiles
    .map(fileName => `<link rel="stylesheet" href="${base}${fileName}">`)
    .join('\n')
}

function scriptTagsFrom (config: AppConfig, islands: IslandDefinition[]) {
  const anySolid = islands.some(island => island.script.includes('@islands/hydration/solid'))
  if (!anySolid) return ''
  return '<script>window._$HY={events:[],completed:new WeakSet(),r:{}}</script>'
}
