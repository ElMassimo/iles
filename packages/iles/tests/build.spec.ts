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
  }, 60000)

  test('generated files', async () => {
    const files = await glob('**/*', { cwd: `${vuePoint}/dist`, onlyFiles: true })
    expect(files.sort()).toEqual(expect.arrayContaining([
      '404.html',
      '_headers',
      'assets/style.3d347fd2.css',
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
    ]))
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
    await assertSnapshot('assets/style.3d347fd2.css')
  })
  test('sitemap', async () => {
    await assertSnapshot('sitemap.xml')
  })
  test('headers', async () => {
    await assertSnapshot('_headers')
  })
  test('rss feed', async () => {
    await assertSnapshot('feed.rss', (content: string) =>
      content
        .replace(/<\/description>.*?<\/lastBuildDate>/s, '</description>')
        .replace(/ \d\d:\d\d:\d\d GMT/g, ''),
    )
  })

  test('remark-mdx-image', async () => {
    const markdownImage = '<p><picture><source media="(-webkit-min-device-pixel-ratio: 1.5)" type="image/avif" srcset="/assets/bench.avif 440w, /assets/bench.avif 758w"><source media="(-webkit-min-device-pixel-ratio: 1.5)" type="image/webp" srcset="/assets/bench.webp 440w, /assets/bench.webp 758w"><source media="(-webkit-min-device-pixel-ratio: 1.5)" srcset="/assets/bench.png 440w, /assets/bench.png 758w"><source type="image/avif" srcset="/assets/bench.avif 758w"><source type="image/webp" srcset="/assets/bench.webp 758w"><img srcset="/assets/bench.png 758w" loading="lazy" src="/assets/bench.png" alt="benchmark"></picture></p>'
    await assertContent('posts/vue-3-2.html', markdownImage)
    await assertContent('feed.rss', markdownImage)
  })

  test('manifest', async () => {
    await assertContent('manifest.json', '"iles/turbo":')
  })
})

async function expectFileContent (path: string, transform?: (val: string) => string) {
  let content = await fs.readFile(`${vuePoint}/dist/${path}`, 'utf-8')
  content = content.replace(/\/assets\/([^.]+)\.\w+\.(\w+)\b/g, '/assets/$1.$2')
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
  expectContent.toContain('<link rel="stylesheet" href="/assets/style.css">')

  expectContent.toContain('<ile-root id="ile-1">'
    + '<div class="text-sm text-gray-500 leading-5">'
    + '<a class="hover:text-gray-700" href="https://github.com/ElMassimo/iles/tree/main/playground/the-vue-point" target="_blank" rel="noopener">'
    + '<span class="hidden sm:inline">GitHub </span>Source</a>')

  if (path.includes('/posts/'))
    expectContent.toContain('<ile-root id="ile-2"><a class="link" href="/">← <!--#-->Back to the blog<!--/--></a></ile-root>')
}
