import { test, describe, expect } from 'vitest'

import NotFound from '@islands/components/NotFound'

describe('not found component', () => {
  test('resolves to existing component', async () => {
    expect(NotFound.title).toEqual('Not Found')
  })
})
