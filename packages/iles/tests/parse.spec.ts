import { test, describe, expect } from 'vitest'

import { parseImports, parseImportVariables } from '@node/plugin/parse'

describe('parsing component imports', () => {
  test('default imports', async () => {
    expect(await parseImports('import __unplugin_components_0 from \'/absolute/path\'')).toEqual({
      __unplugin_components_0: {
        importName: 'default',
        name: '__unplugin_components_0',
        path: '/absolute/path',
      },
    })
  })

  test('named imports', async () => {
    expect(await parseImports('import { Button as __unplugin_components_1 } from \'ant-design-vue/es\'')).toEqual({
      __unplugin_components_1: {
        importName: 'Button',
        name: '__unplugin_components_1',
        path: 'ant-design-vue/es',
      },
    })
  })
})

describe('parseImportVariables', () => {
  test('parse import statements', () => {
    expect(parseImportVariables('import \''))
      .toEqual([])
    expect(parseImportVariables('import Button from \''))
      .toEqual([['default', 'Button']])
    expect(parseImportVariables('import Button from \''))
      .toEqual([['default', 'Button']])
    expect(parseImportVariables('import { default as Button } from \''))
      .toEqual([['default', 'Button']])
    expect(parseImportVariables('import{ default as Button }from \''))
      .toEqual([['default', 'Button']])
    expect(parseImportVariables('import{B as X}from \''))
      .toEqual([['B', 'X']])
    expect(parseImportVariables('import { B as X, C as D } from \''))
      .toEqual([['B', 'X'], ['C', 'D']])
    expect(parseImportVariables('import * as Button from \''))
      .toEqual([['*', 'Button']])

    // Stress test
    expect(parseImportVariables('import{B as X}, * as D, C, { C as F } from \''))
      .toEqual([['B', 'X'], ['*', 'D'], ['default', 'C'], ['C', 'F']])
    expect(parseImportVariables(`import
      {
        B as X,
      },
      * as D,
      C,
      { C as F } from '`,
    ))
      .toEqual([['B', 'X'], ['*', 'D'], ['default', 'C'], ['C', 'F']])
  })
})
