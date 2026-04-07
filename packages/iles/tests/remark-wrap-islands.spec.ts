import { describe, expect, test } from 'vite-plus/test'
import type { AppConfig } from 'iles'

import remarkWrapIslands from '@node/plugin/remarkWrapIslands'

describe('remarkWrapIslands listener diagnostics', () => {
  test('warns for mdx listeners outside islands', async () => {
    const warnings: string[] = []
    const previousWarn = console.warn
    console.warn = (message: any) => warnings.push(String(message))

    const plugin = remarkWrapIslands({
      config: {
        namedPlugins: { components: { api: {} } },
      } as any as AppConfig,
    })

    const ast: any = {
      type: 'root',
      children: [{
        type: 'mdxJsxFlowElement',
        name: 'button',
        position: { start: { line: 2, column: 3 } },
        attributes: [{ type: 'mdxJsxAttribute', name: 'onClick', position: { start: { line: 2, column: 10 } } }],
      }],
    }
    await plugin(ast, { path: '/src/pages/demo.mdx' })

    console.warn = previousWarn
    expect(warnings[0]).toContain("Listener 'onClick'")
    expect(warnings[0]).toContain('/src/pages/demo.mdx')
  })
})
