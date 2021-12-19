import { test, describe, expect } from 'vitest'

describe('page data', () => {
  test('for markdown file', async () => {
    const doc = await import('@pages/posts/vue-3-2.mdx').then(m => m.default)

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

  test('for vue file', async () => {
    const doc = await import('@pages/404.vue').then(m => m.default)

    expect(typeof doc.render).toEqual('function')
    expect(typeof doc.__hmrId).toEqual('string')

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
