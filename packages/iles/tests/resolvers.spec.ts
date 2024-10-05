import path from 'node:path'
import { describe, expect } from 'vitest'

import { IlesComponentResolver, IlesLayoutResolver } from '@node/config'
import { ISLAND_COMPONENT_PATH } from '@node/alias'

const projectRoot = path.resolve(__dirname, '../../..')
const vuePoint = `${projectRoot}/playground/the-vue-point`

describe('resolvers', () => {
  it('can resolve Island and Head', async () => {
    const resolve = IlesComponentResolver
    expect(resolve('Island')).toEqual({ from: ISLAND_COMPONENT_PATH })
    expect(resolve('Head')).toEqual({ name: 'Head', from: '@unhead/vue' })
    expect(resolve('Something')).toEqual(undefined)
  })

  it('can resolve layouts', async () => {
    const layoutsDir = path.resolve(vuePoint, 'src/layouts')
    const resolve = IlesLayoutResolver({ layoutsDir })

    expect(resolve('DefaultLayout'))
      .toEqual({ name: 'default', from: `${layoutsDir}/default.vue` })

    expect(resolve('PostLayout'))
      .toEqual({ name: 'default', from: `${layoutsDir}/post.vue` })

    expect(resolve('SomethingElseLayout'))
      .toEqual(undefined)

    expect(resolve('Layout')).toEqual(undefined)
  })
})
