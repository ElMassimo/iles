import { describe, expect, test } from 'vite-plus/test'

import { guardListenerCall } from '../src/client/app/listenerGuard'

describe('listener guard', () => {
  test('calls original handler when no island context and reports once', () => {
    const errors: any[] = []
    const previousConsoleError = console.error
    console.error = (...args: any[]) => { errors.push(args) }
    ;(globalThis as any).window = {
      __ILE_DEVTOOLS__: { reportStaticListenerWarning: () => {} },
    }

    const event = { type: 'click', target: { nodeName: 'BUTTON', closest: () => null } } as any
    let called = 0
    guardListenerCall(() => ++called, event, { source: 'vue', event: 'click', tag: 'button', line: 1, column: 2 })
    guardListenerCall(() => ++called, event, { source: 'vue', event: 'click', tag: 'button', line: 1, column: 2 })

    console.error = previousConsoleError
    expect(called).toBe(2)
    expect(errors.length).toBe(1)
  })

  test('does not report when inside an island', () => {
    const errors: any[] = []
    const previousConsoleError = console.error
    console.error = (...args: any[]) => { errors.push(args) }
    ;(globalThis as any).window = {
      __ILE_DEVTOOLS__: { reportStaticListenerWarning: () => {} },
    }

    const event = { type: 'click', target: { closest: () => ({}) } } as any
    const result = guardListenerCall(() => 42, event, { source: 'mdx', event: 'click', tag: 'button' })

    console.error = previousConsoleError
    expect(result).toBe(42)
    expect(errors.length).toBe(0)
  })
})
