import { resolve } from 'path'
import { promises as fs } from 'fs'
import { test, describe, expect, beforeAll } from 'vitest'

import execa from 'execa'
import glob from 'fast-glob'

const projectRoot = resolve(__dirname, '../../..')
const vuePoint = `${projectRoot}/playground/the-vue-point`

describe('building docs site', () => {
  beforeAll(async () => {
    await execa('npm', ['run', 'build'], { stdio: process.env.DEBUG ? 'inherit' : undefined, cwd: vuePoint })
  }, 30000)

  test('generated files', async () => {
    const files = await glob('**/*', { cwd: `${vuePoint}/dist`, onlyFiles: true })
    expect(files.sort()).toEqual([
      '404.html',
      '_headers',
      'assets/bench.0d0ef746.avif',
      'assets/bench.3a2b8c2a.png',
      'assets/bench.3b82a5c5.avif',
      'assets/bench.3f1dac6b.png',
      'assets/bench.7cfd33ca.png',
      'assets/bench.99843580.webp',
      'assets/bench.9f1a2c1a.webp',
      'assets/bench.aedf485a.webp',
      'assets/bench.c51c35ca.avif',
      'assets/one-piece.7449be34.png',
      'assets/one-piece.7cc06399.avif',
      'assets/one-piece.90cbb4e4.avif',
      'assets/one-piece.a5c231c8.png',
      'assets/one-piece.bd5f4a10.webp',
      'assets/one-piece.dca2948a.webp',
      'assets/style.daf210ac.css',
      'assets/turbo.a9e83070.js',
      'favicon.ico',
      'feed.rss',
      'index.html',
      'logo.svg',
      'manifest.json',
      'posts/1.html',
      'posts/2.html',
      'posts/hello-2021.html',
      'posts/vue-3-2.html',
      'posts/vue-3-one-piece.html',
      'sitemap.xml',
    ])
  })

  test('html files', async () => {
    await assertHTML('404.html', { title: 'Not Found' })
    await assertHTML('index.html')
    await assertHTML('posts/1.html')
    await assertHTML('posts/2.html')
    await assertHTML('posts/hello-2021.html', { title: 'Reflections for 2020-2021' })
    await assertHTML('posts/vue-3-2.html', { title: 'Vue 3.2 Released!' })
    await assertHTML('posts/vue-3-one-piece.html', { title: 'Announcing Vue 3.0 "One Piece"' })
  })

  test('styles', async () => {
    await assertSnapshot('assets/style.daf210ac.css')
  })
  test('sitemap', async () => {
    await assertSnapshot('sitemap.xml')
  })
  test('headers', async () => {
    await assertSnapshot('_headers')
  })
  test('rss feed', async () => {
    await assertSnapshot('feed.rss', (content: string) =>
      content.replace(/<\/description>.*?<\/lastBuildDate>/s, '</description>'))
  })

  test('remark-mdx-image', async () => {
    const markdownImage = '<p><picture><source media="(-webkit-min-device-pixel-ratio: 1.5)" type="image/avif" srcset="/assets/bench.c51c35ca.avif 440w, /assets/bench.3b82a5c5.avif 758w"><source media="(-webkit-min-device-pixel-ratio: 1.5)" type="image/webp" srcset="/assets/bench.9f1a2c1a.webp 440w, /assets/bench.99843580.webp 758w"><source media="(-webkit-min-device-pixel-ratio: 1.5)" srcset="/assets/bench.7cfd33ca.png 440w, /assets/bench.3f1dac6b.png 758w"><source type="image/avif" srcset="/assets/bench.0d0ef746.avif 758w"><source type="image/webp" srcset="/assets/bench.aedf485a.webp 758w"><img srcset="/assets/bench.3a2b8c2a.png 758w" loading="lazy" src="/assets/bench.3a2b8c2a.png" alt="benchmark"></picture></p>'
    await assertContent('posts/vue-3-2.html', markdownImage)
    await assertContent('feed.rss', markdownImage)
  })

  test('manifest', async () => {
    await assertContent('manifest.json', '"iles/turbo":')
  })
})

async function expectFileContent (path: string, transform?: (val: string) => string) {
  const content = await fs.readFile(`${vuePoint}/dist/${path}`, 'utf-8')
  return expect(transform ? transform(content) : content)
}

async function assertSnapshot (path: string, transform?: (val: string) => string) {
  const expectContent = await expectFileContent(path, transform)
  expectContent.toMatchSnapshot()
  return expectContent
}

async function assertContent (path: string, content: string) {
  const expectContent = await expectFileContent(path)
  expectContent.toContain(content)
}

async function assertHTML (path: string, { title }: any = {}) {
  const expectContent = await expectFileContent(path)
  expectContent.toMatchSnapshot()
  expectContent.toContain(`<title>${`${title ? `${title} · ` : ''}The Vue Point`}</title>`)
  expectContent.toContain('<meta charset="UTF-8">')
  expectContent.toContain('<meta name="description" content="Updates, tips &amp; opinions from the maintainers of Vue.js.">')
  expectContent.toContain('<link rel="sitemap" href="https://the-vue-point-with-iles.netlify.app/sitemap.xml">')
  expectContent.toContain(`<meta property="og:url" content="https://the-vue-point-with-iles.netlify.app/${path.replace('index.html', '')}">`)
  expectContent.toContain('<link rel="stylesheet" href="/assets/style.daf210ac.css">')

  expectContent.toContain('<ile-root id="ile-1">'
    + '<div class="text-base text-gray-500 leading-5">'
    + '<a class="hover:text-gray-700 mr-4" href="/feed.rss">RSS Feed</a>')

  if (path.includes('/posts/'))
    expectContent.toContain('<ile-root id="ile-2"><a class="link" href="/">← <!--#-->Back to the blog<!--/--></a></ile-root>')
}
