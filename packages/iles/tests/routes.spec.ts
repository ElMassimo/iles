import { describe, expect, it } from 'vitest'

import routes from '@islands/routes'

import vue32 from '@pages/posts/vue-3-2.mdx'
import notFound from '@pages/404.vue'

describe('app routes', () => {
  it('empty', async () => {
    expect(routes.map(route => route.path)).toEqual([
      '/',
      '/404',
      '/feed.rss',
      '/posts/hello-2021',
      '/posts/volar-1-0',
      '/posts/vue-2-7-beta',
      '/posts/vue-2-7-naruto',
      '/posts/vue-3-2',
      '/posts/vue-3-as-the-new-default',
      '/posts/vue-3-one-piece',
      '/posts/:page',
      '/:zzz(.*)*',
    ])
  })
})

describe('page data', () => {
  it('for markdown file', async () => {
    const doc = vue32

    expect(typeof doc.render).toEqual('function')
    expect(typeof doc.__hmrId).toEqual('string')

    const { layoutName } = doc
    expect(layoutName).toEqual('default')

    const { filename, href } = doc
    expect(filename).toEqual('playground/the-vue-point/src/pages/posts/vue-3-2.mdx')
    expect(href).toEqual('/posts/vue-3-2')

    const { title, date, author, gravatar, twitter } = doc
    expect(title).toEqual('Vue 3.2 Released!')
    expect(date.constructor.toString()).toContain('Date')
    expect(author).toEqual('Evan You')
    expect(gravatar).toEqual('eca93da2c67aadafe35d477aa8f454b8')
    expect(twitter).toEqual('@youyuxi')

    const { frontmatter, meta, route } = doc
    expect(frontmatter).toMatchObject({ title, author, gravatar, twitter })
    expect(meta).toMatchObject({ filename, href })
    expect(route).toEqual(undefined)
  })

  it('for vue file', async () => {
    const doc = notFound

    expect(typeof doc.render).toEqual('function')
    expect(typeof doc.__file).toEqual('string')

    const { layoutName } = doc
    expect(layoutName).toEqual('default')

    const { filename, href } = doc
    expect(filename).toEqual('playground/the-vue-point/src/pages/404.vue')
    expect(href).toEqual('/404')

    const { title } = doc
    expect(title).toEqual('Not Found')

    const { frontmatter, meta, route } = doc
    expect(frontmatter).toMatchObject({ title })
    expect(meta).toMatchObject({ filename, href })
    expect(route).toEqual(undefined)
  })
})
