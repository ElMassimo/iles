import { promises as fs } from 'fs'
import { join } from 'pathe'
import type { AppConfig, RouteToRender } from '../shared'
import { withSpinner, warnMark } from './utils'

export async function createSitemap (config: AppConfig, routesToRender: RouteToRender[]) {
  const { outDir, base, siteUrl, ssg: { sitemap } } = config
  if (!sitemap) return
  if (!siteUrl) return console.warn(warnMark, 'Skipping sitemap. Configure `siteUrl` to enable sitemap generation.')
  withSpinner('rendering sitemap', async () => {
    const sitemap = sitemapFor(`${siteUrl}${base}`, routesToRender)
    await fs.mkdir(outDir, { recursive: true })
    await fs.writeFile(join(outDir, 'sitemap.xml'), sitemap, 'utf8')
  })
}

// Internal: Create a sitemap for the rendered pages.
function sitemapFor (siteUrl: string, routesToRender: RouteToRender[]) {
  const pageUrls = new Set<string>()

  // look through built pages, only add HTML
  for (const route of routesToRender) {
    if (!route.outputFilename.endsWith('.html')) continue
    if (route.path === '/404') continue
    pageUrls.add(route.path)
  }

  const sortedUrls = Array.from(pageUrls)
    .sort((a, b) => a.localeCompare(b, 'en', { numeric: true }))

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sortedUrls.map(url => `  <url><loc>${join(siteUrl, url)}</loc></url>\n`).join('')}
</urlset>
`
}
