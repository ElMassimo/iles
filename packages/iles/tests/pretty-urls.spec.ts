import { toExplicitHtmlPath } from '@mdx/utils'
import { describe, expect, it } from 'vitest'

describe('prettyUrls', () => {
  const expectExplicitPath = (path: string) => expect(toExplicitHtmlPath(path))

  it('internal urls', () => {
    expectExplicitPath('/about/').toEqual('/about/')
    expectExplicitPath('/about').toEqual('/about.html')
    expectExplicitPath('/about/index.html').toEqual('/about/')
    expectExplicitPath('/about/nested.html').toEqual('/about/nested.html')
  })

  it('anchor tags', () => {
    expectExplicitPath('#contact').toEqual('#contact')

    expectExplicitPath('/about#contact').toEqual('/about.html#contact')
    expectExplicitPath('/about/index.html#contact').toEqual('/about/#contact')

    expectExplicitPath('https://example.com/about#contact').toEqual('https://example.com/about#contact')
    expectExplicitPath('https://example.com/#contact').toEqual('https://example.com/#contact')
  })

  it('internal assets', () => {
    expectExplicitPath('/assets/picture.gif').toEqual('/assets/picture.gif')
  })

  it('external urls', () => {
    expectExplicitPath('https://example.com').toEqual('https://example.com')
    expectExplicitPath('https://example.com/').toEqual('https://example.com/')
    expectExplicitPath('http://example.com/').toEqual('http://example.com/')
  })
})
