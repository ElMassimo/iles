import { pascalCase, serialize } from '../src/utils/string'

describe('case conversions', () => {
  test('pascalCase', async () => {
    expect(pascalCase('AudioPlayer')).toEqual('AudioPlayer')
    expect(pascalCase('audio-player')).toEqual('AudioPlayer')
    expect(pascalCase('bx:bx-sun')).toEqual('BxBxSun')
  })
})

describe('serialize', () => {
  test('to string', async () => {
    const audio = '/song.mp3'
    const recordedAt = new Date()
    const value = { audio, recordedAt }
    const serialized = serialize(value)
    console.log({ serialized })
    // eslint-disable-next-line no-new-func
    expect(Function(`return ${serialized}`)()).toEqual(value)
  })
})
