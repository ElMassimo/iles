import { describe, expect, it } from 'vitest'

import { extendSite } from '@node/plugin/site'

describe('site', () => {
  it('without data', () => {
    const extended = extendSite(`
export default {}
`, { siteUrl: 'http://example.com', base: '/' })
    expect(extended).toMatchSnapshot()
  })

  it('without site url', () => {
    const extended = extendSite(`
const site = {
  title: 'îles',
}

export default site
`, { siteUrl: '', base: '/' })
    expect(extended).toMatchSnapshot()
  })

  it('with site url', () => {
    const extended = extendSite(`
export default {
  title: 'îles',
}
`, { siteUrl: 'https://example.com', base: '/awesome/' })
    expect(extended).toMatchSnapshot()
  })
})
