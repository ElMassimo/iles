import { resolve } from 'path'
import { promises as fs } from 'fs'
import { test, describe, expect, beforeAll, afterAll } from 'vitest'
import { chromium, type Browser, type Page } from 'playwright'
import { execa } from 'execa'

const docsRoot = resolve(__dirname, '..')
const distDir = resolve(docsRoot, 'dist')

let browser: Browser
let serverProcess: ReturnType<typeof execa> | undefined

const PORT = 3055

async function waitForHydration (page: Page) {
  await page.waitForFunction(() => {
    const islands = document.querySelectorAll('ile-root')
    return Array.from(islands).filter(el => el.hasAttribute('hydrated')).length >= 3
  }, { timeout: 10000 })
}

async function assertVisible (page: Page, selector: string) {
  await page.waitForSelector(selector, { state: 'visible', timeout: 5000 })
}

async function assertHidden (page: Page, selector: string) {
  await page.waitForSelector(selector, { state: 'hidden', timeout: 5000 })
}

describe('docs site', () => {
  beforeAll(async () => {
    await execa('npm', ['run', 'build'], { cwd: docsRoot, stdio: process.env.DEBUG ? 'inherit' : undefined })

    // Start a static file server.
    serverProcess = execa('npx', ['serve', distDir, '-l', String(PORT), '--no-clipboard'], { cwd: docsRoot })
    // Wait for server to be ready.
    for (let i = 0; i < 30; i++) {
      try {
        const res = await fetch(`http://localhost:${PORT}/`)
        if (res.ok) break
      }
      catch {}
      await new Promise(r => setTimeout(r, 200))
    }

    browser = await chromium.launch()
  }, 120_000)

  afterAll(async () => {
    await browser?.close()
    serverProcess?.kill()
  })

  test('pwa-manifest.json is valid JSON', async () => {
    const manifestPath = resolve(distDir, 'pwa-manifest.json')
    const content = await fs.readFile(manifestPath, 'utf-8')
    const manifest = JSON.parse(content)
    expect(manifest.name).toBe('îles')
    expect(manifest.theme_color).toBe('#5C7E8F')
    expect(manifest.icons).toHaveLength(3)

    // Verify it's served with the correct content type, not as HTML.
    const res = await fetch(`http://localhost:${PORT}/pwa-manifest.json`)
    expect(res.headers.get('content-type')).toContain('application/json')
    const body = await res.json()
    expect(body.name).toBe('îles')
  })

  test('search modal opens and can navigate to pages', async () => {
    const page = await browser.newPage()

    await page.goto(`http://localhost:${PORT}/`)
    await waitForHydration(page)

    // Open search via the search button.
    await page.locator('.nav-bar-button[aria-label="Search"]').click()
    await assertVisible(page, '.DocSearch-Modal')

    // Close and reopen with keyboard shortcut.
    await page.keyboard.press('Escape')
    await assertHidden(page, '.DocSearch-Modal')
    await page.keyboard.press('Meta+k')
    await assertVisible(page, '.DocSearch-Modal')

    // Type a search query and navigate to a result.
    await page.locator('.DocSearch-Input').fill('hydration')
    await page.waitForSelector('.DocSearch-Hit', { timeout: 5000 })
    await page.locator('.DocSearch-Hit').first().click()

    // Verify navigation happened — should be on a guide page about hydration.
    await page.waitForFunction(
      () => window.location.pathname.includes('hydration')
        || document.querySelector('h1')?.textContent?.toLowerCase().includes('hydration'),
      { timeout: 5000 },
    )
    expect(page.url()).toContain('hydration')

    await page.close()
  }, 30_000)

  test('search works after turbo navigation', async () => {
    const page = await browser.newPage()

    await page.goto(`http://localhost:${PORT}/`)
    await waitForHydration(page)

    // Navigate to another page via sidebar link.
    await page.locator('a').filter({ hasText: 'FAQs' }).first().click()
    await page.waitForSelector('h1')
    expect(await page.locator('h1').textContent()).toContain('FAQs')

    // Wait for re-hydration after turbo navigation.
    await waitForHydration(page)

    // Search should still work after navigation.
    await page.keyboard.press('Meta+k')
    await assertVisible(page, '.DocSearch-Modal')

    await page.keyboard.press('Escape')
    await assertHidden(page, '.DocSearch-Modal')

    await page.close()
  }, 30_000)
})
