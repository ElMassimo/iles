import { describe, expect, it } from 'vitest'

import Island from '@components/Island.vue'

describe('exports', () => {
  it('ensure island component can be resolved', () => {
    expect(Island.name).toEqual('Island')
  })
})
