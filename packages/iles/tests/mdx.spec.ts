import { test, describe, expect } from 'vite-plus/test'

import IlesMdx from '@mdx/mdx-vite-plugins'

describe('mdx plugin', () => {
  test('should not transform virtual documents module ending with .mdx', async () => {
    const plugins = IlesMdx()
    const compilePlugin = plugins.find(p => p.name === 'iles:mdx:compile')!

    // Simulate configResolved to initialize the processor
    await (compilePlugin as any).configResolved({ mode: 'production', build: { sourcemap: false } })

    const virtualDocId = '/@islands/documents?pattern=~/pages/posts/*.mdx'
    const result = await (compilePlugin as any).transform('export default []', virtualDocId)
    expect(result).toBeUndefined()
  })

  test('should not transform virtual documents module with .mdx in query', async () => {
    const plugins = IlesMdx()
    const sfcPlugin = plugins.find(p => p.name === 'iles:mdx:sfc')!

    await (plugins[0] as any).configResolved({ mode: 'development', build: { sourcemap: false } })

    const virtualDocId = '/@islands/documents?pattern=src/posts/hello.mdx'
    const result = await (sfcPlugin as any).transform('export default []', virtualDocId)
    expect(result).toBeUndefined()
  })

  test('should still transform actual .mdx files', async () => {
    const plugins = IlesMdx()
    const compilePlugin = plugins.find(p => p.name === 'iles:mdx:compile')!

    await (compilePlugin as any).configResolved({ mode: 'production', build: { sourcemap: false } })

    const mdxContent = '# Hello World'
    const result = await (compilePlugin as any).transform(mdxContent, '/src/pages/post.mdx')
    expect(result).toBeDefined()
    expect(result.code).toBeDefined()
  })
})
