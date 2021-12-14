import { test, describe, expect, beforeAll } from 'vitest'

import { IlesComponentResolver, IlesLayoutResolver } from '@node/config'

describe('resolvers', () => {
  test('can resolve Island and Head', async () => {
    const resolve = IlesComponentResolver
    expect(resolve('Island')).toEqual({ importName: 'Island', path: 'iles' })
    expect(resolve('Head')).toEqual({ importName: 'Head', path: '@vueuse/head' })
    expect(resolve('Something')).toEqual(undefined)
  })

  test('can resolve layouts', async () => {
    const resolve = IlesLayoutResolver({ layoutsDir: '/layouts' })

    expect(resolve('DefaultLayout'))
      .toEqual({ importName: 'default', path: '/layouts/default.vue' })

    expect(resolve('SomethingElseLayout'))
      .toEqual({ importName: 'default', path: '/layouts/somethingElse.vue' })

    expect(resolve('Layout')).toEqual(undefined)
  })
})
