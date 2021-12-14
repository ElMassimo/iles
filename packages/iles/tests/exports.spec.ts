import { test, describe, expect, beforeAll } from 'vitest'

import { Island } from 'iles'

describe('exports', () => {
  test('ensure island component can be resolved', async () => {
    expect(Island.name).toEqual('Island')
  })
})
