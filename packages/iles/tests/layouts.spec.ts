import { test, describe, expect } from 'vitest'

import layout from '/src/layouts/default.vue'

describe('layouts', () => {
  test('stub default layout', () => {
    expect(layout.name).toEqual('DefaultLayout')
  })
})
