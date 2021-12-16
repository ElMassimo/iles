import { test, describe, expect } from 'vitest'

import emptyApp from '@islands/user-app'

describe('user app', () => {
  test('can import empty app', () => {
    expect(emptyApp).toEqual({})
  })
})
