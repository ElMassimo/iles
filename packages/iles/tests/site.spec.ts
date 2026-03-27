import { test, describe, expect } from 'vite-plus/test'
import type { AppConfig } from 'iles'

import { extendSite } from '@node/plugin/site'

describe('site', () => {
  test('without data', () => {
    const extended = extendSite(`
export default {}
`, { siteUrl: 'http://example.com', base: '/' } satisfies Partial<AppConfig> as AppConfig)
    expect(extended).toMatchSnapshot()
  })

  test('without site url', () => {
    const extended = extendSite(`
const site = {
  title: 'îles',
}

export default site
`, { siteUrl: '', base: '/' } satisfies Partial<AppConfig> as AppConfig)
    expect(extended).toMatchSnapshot()
  })

  test('with site url', () => {
    const extended = extendSite(`
export default {
  title: 'îles',
}
`, { siteUrl: 'https://example.com', base: '/awesome/' } satisfies Partial<AppConfig> as AppConfig)
    expect(extended).toMatchSnapshot()
  })
})
