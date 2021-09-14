/// <reference types="@peeky/runner" />

import { pascalCase } from '../src/node/plugin/utils'

describe('case conversions', () => {
  test('pascalCase', async () => {
    expect(pascalCase('AudioPlayer')).toEqual('AudioPlayer')
    expect(pascalCase('audio-player')).toEqual('AudioPlayer')
    expect(pascalCase('bx:bx-sun')).toEqual('BxBxSun')
  })
})
