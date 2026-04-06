import { describe, expect, test } from 'vite-plus/test'
import type { AppConfig } from 'iles'

import { wrapIslandsInSFC } from '@node/plugin/wrap'

const minimalConfig = {
  namedPlugins: {
    components: {
      api: {
        findComponent: async () => ({ from: '/comp.vue', name: 'default' }),
        stringifyImport: () => `import __ile_components_0 from '/comp.vue'`,
      },
    },
    pages: { api: { isPage: () => true } },
  },
  resolvePath: async (path: string) => path,
} as any as AppConfig

describe('wrapIslandsInSFC listener diagnostics', () => {
  test('warns for listeners outside islands', async () => {
    const warnings: string[] = []
    await wrapIslandsInSFC(minimalConfig, `<template><button @click="count++">x</button></template>`, '/src/pages/a.vue', {
      analyzeListeners: true,
      warn: warning => warnings.push(warning.message),
    })
    expect(warnings[0]).toContain("Listener 'click'")
    expect(warnings[0]).toContain('/src/pages/a.vue')
  })

  test('wraps listener handlers', async () => {
    const result = await wrapIslandsInSFC(minimalConfig, `<template><button @click="count++">x</button></template>`, '/src/pages/a.vue', {
      wrapListeners: true,
    })
    expect(result?.code).toContain('__ILE_GUARD_LISTENER_CALL__')
  })
})

