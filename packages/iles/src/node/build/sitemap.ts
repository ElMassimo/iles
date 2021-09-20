import { join } from 'path'
import { promises as fs } from 'fs'
import type { AppConfig, SSGRoute } from '../shared'
import { withSpinner, warnMark } from './utils'

export async function createSitemap (config: AppConfig, routesToRender: SSGRoute[]) {
  const { outDir, siteUrl, ssg: { sitemap } } = config
  if (!sitemap) return
  if (!siteUrl) return console.warn(warnMark, 'Skipping sitemap. Configure `siteUrl` to enable sitemap generation.')
  withSpinner('rendering sitemap', async () => {
    const sitemap = sitemapFor(siteUrl, routesToRender)
    await fs.mkdir(outDir, { recursive: true })
    await fs.writeFile(join(outDir, 'sitemap.xml'), sitemap, 'utf8')
  })
}

// Internal: Create a sitemap for the rendered pages.
function sitemapFor (siteUrl: string, routesToRender: SSGRoute[]) {
  const pageUrls = new Set<string>()

  // look through built pages, only add HTML
  for (const ssgRoute of routesToRender) {
    if (ssgRoute.extension !== '.html') continue
    if (ssgRoute.path === '/404') continue
    pageUrls.add(ssgRoute.path)
  }

  const sortedUrls = Array.from(pageUrls)
    .sort((a, b) => a.localeCompare(b, 'en', { numeric: true }))

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sortedUrls.map(url => `  <url><loc>${join(siteUrl, url)}</loc></url>\n`).join('')}
</urlset>
`
}
