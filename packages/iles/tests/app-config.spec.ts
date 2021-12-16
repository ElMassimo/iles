import { test, describe, expect } from 'vitest'

import config from '@islands/app-config'

describe('app config', () => {
  test('site url', async () => {
    expect(config.root).toEqual(process.cwd())
    expect(config.base).toEqual('/')
    expect(config.siteUrl).toEqual('https://example.com')
    expect(config.debug).toEqual(true)
    expect(config.jsx).toEqual(undefined)
  })
})
