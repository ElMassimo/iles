import { parseImports } from '../src/parse.ts'

describe('parsing component imports', () => {
  test('default imports', () => {
    expect(parseImports("import __unplugin_components_0 from '/absolute/path'")).toEqual({
      __unplugin_components_0: '/absolute/path',
    })
  })

  test('named imports', () => {
    expect(parseImports("import { Button as __unplugin_components_1 } from 'ant-design-vue/es'")).toEqual({
      __unplugin_components_1: { importName: 'Button', path: 'ant-design-vue/es' },
    })
  })
})
