import { existsSync } from 'fs'
import { join } from 'pathe'
import { renderSSRHead } from '@unhead/ssr'
import type { RollupOutput } from 'rollup'
import { renderers } from '@islands/prerender'
import { IslandDefinition } from 'iles'
import { renderToString } from 'vue/server-renderer'
import type { Awaited, AppConfig, CreateAppFactory, IslandsByPath, RouteToRender } from '../shared'
import type { bundle } from './bundle'
import { withSpinner } from './utils'
import { getRoutesToRender } from './routes'
import { getUserShell } from '../plugin/html';

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

  const { headTags, htmlAttrs, bodyTagsOpen, bodyTags, bodyAttrs } = await renderSSRHead(head)

  const {
    userShell,
    isValidUserShell,
    errorMsgUserShell,
  } = await getUserShell(config)

  if (!isValidUserShell) {
    throw new Error(errorMsgUserShell)
  }

  // Tried prettier format(), but it adds closing tag to void tags (link) which results in css not loading correctly, hence dropped it
  // let transformedHtml = await format(userShell, { parser: 'html' });
  // TODO: prettierx is a prettier fork with option to format without this issue
  // let transformedHtml = await format(userShell, { parser: 'html', htmlVoidTags: true });
  let transformedHtml = userShell

  // Add <!DOCTYPE html> if missing
  const doctypeRegex = /^\s*<!DOCTYPE html>/i
  if (!doctypeRegex.test(transformedHtml)) {
    transformedHtml = `<!DOCTYPE html>${transformedHtml}`;
  }

  // const ilesDevShellRegex = /<script\s[^>]*src=["']\/@iles-entry["'][^>]*>\s*<\/script>/gi
  const ilesDevShellRegex = /<script\s[^>]*src=["']\/@iles-entry["'][^>]*>\s*<\/script>\s*/gi;

  // TODO: Instead of string replacement, best to parse the html using parse5 to update it. User could already have meta tags defined in their userShell, and iles shall add duplicate them.
  transformedHtml = transformedHtml
    .replace(/<html([^>]*)>/, `<html$1 ${htmlAttrs}>`) // Add placeholder to html tag
    .replace(/<\/head>/, `  ${headTags}\n    ${stylesheetTagsFrom(config, clientChunks)}\n    ${await scriptTagsFrom(config, islandsByPath[route.path])}\n  </head>`) // Append placeholders to head
    .replace(/<body([^>]*)>/, `<body$1 ${bodyAttrs}>`) // Add placeholder to body tag
    .replace(/<div id="app">/, `${bodyTagsOpen}<div id="app">${content}`) // Add placeholders to app div
    .replace(/<\/body>/, `${bodyTags}  </body>`) // Add closing body placeholders
    .replace(ilesDevShellRegex, ''); // Remove iles dev shell if it exists as it's only for development

  const html = isValidUserShell ? transformedHtml : `<!DOCTYPE html>
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

  return html
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
