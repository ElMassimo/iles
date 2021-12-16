import { test, describe, expect } from 'vitest'

import { IlesComponentResolver, IlesLayoutResolver } from '@node/config'
import { ISLAND_COMPONENT_PATH } from '@node/alias'

describe('resolvers', () => {
  test('can resolve Island and Head', async () => {
    const resolve = IlesComponentResolver
    expect(resolve('Island')).toEqual({ path: ISLAND_COMPONENT_PATH })
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
