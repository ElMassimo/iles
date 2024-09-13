import { test, describe, expect } from 'vitest'

import { pascalCase, serialize } from '@node/plugin/utils'

describe('case conversions', () => {
  test('pascalCase', () => {
    expect(pascalCase('AudioPlayer')).toEqual('AudioPlayer')
    expect(pascalCase('audio-player')).toEqual('AudioPlayer')
    expect(pascalCase('bx:bx-sun')).toEqual('BxBxSun')
  })
})

describe('serialize', () => {
  test('to string', () => {
    const audio = '/song.mp3'
    const recordedAt = new Date()
    const value = { audio, recordedAt }
    const serialized = serialize(value)
    // eslint-disable-next-line no-new-func
    expect(Function(`return ${serialized}`)()).toEqual(value)
  })
})
