import { test, describe, expect } from 'vitest'

import routes from '@islands/routes'

describe('app routes', () => {
  test('empty', async () => {
    expect(routes.map(route => route.path)).toEqual([
      '/',
      '/404',
      '/feed.rss',
      '/posts/hello-2021',
      '/posts/vue-3-2',
      '/posts/vue-3-one-piece',
      '/posts/:page',
    ])
  })
})
