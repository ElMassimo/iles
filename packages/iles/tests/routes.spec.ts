import { test, describe, expect, beforeAll } from 'vitest'

import routes from '@islands/routes'

describe('app routes', () => {
  test('empty', async () => {
    expect(routes).toEqual([])
  })
})
