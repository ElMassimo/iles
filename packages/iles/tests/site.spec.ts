import { test, describe, expect, beforeAll } from 'vitest'

import { extendSite } from '@node/plugin/site'

describe('site', () => {
  test('without data', () => {
    const extended = extendSite(`
export default {}
`, { siteUrl: 'http://example.com', base: '/' })
    expect(extended).toMatchSnapshot()
  })

  test('without site url', () => {
    const extended = extendSite(`
const site = {
  title: 'îles',
}

export default site
`, { siteUrl: '', base: '/' })
    expect(extended).toMatchSnapshot()
  })

  test('with site url', () => {
    const extended = extendSite(`
export default {
  title: 'îles',
}
`, { siteUrl: 'https://example.com', base: '/awesome/' })
    expect(extended).toMatchSnapshot()
  })
})
