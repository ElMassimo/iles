import { describe, expect, it } from 'vitest'

import emptyApp from '@islands/user-app'

describe('user app', () => {
  it('can import empty app', () => {
    expect(emptyApp).toEqual({})
  })
})
