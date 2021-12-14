import { test, describe, expect, beforeAll } from 'vitest'

import NotFound from '@islands/components/NotFound'

describe('not found component', () => {
  test('can resolve alias', async () => {
    expect(NotFound.name).toEqual('NotFound')
  })
})
