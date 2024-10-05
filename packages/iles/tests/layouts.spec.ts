import { describe, expect, it } from 'vitest'

import layout from '/src/layouts/default.vue'

describe('layouts', () => {
  it('stub default layout', () => {
    expect(layout.name).toEqual('DefaultLayout')
  })
})
