import { test, describe, expect, beforeAll } from 'vitest'

import emptyApp from '@islands/user-app'

describe('user app', () => {
  test('can import empty app', () => {
    expect(emptyApp).toEqual({})
  })
})
