import { describe, expect, it } from 'vitest'

import NotFound from '@islands/components/NotFound'

describe('not found component', () => {
  it('resolves to existing component', () => {
    expect(NotFound.name).toEqual('NotFound')
  })
})
