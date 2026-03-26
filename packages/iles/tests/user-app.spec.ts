import { test, describe, expect } from 'vite-plus/test'

import emptyApp from '@islands/user-app'

describe('user app', () => {
  test('can import empty app', () => {
    expect(emptyApp).toEqual({})
  })
})
