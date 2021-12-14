import { test, describe, expect, beforeAll } from 'vitest'

import layout from '/src/layouts/default.vue'

describe('layouts', () => {
  test('stub default layout', () => {
    expect(layout.name).toEqual('DefaultLayout')
  })
})
