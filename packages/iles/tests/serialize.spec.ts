/// <reference types="@peeky/runner" />

import { serialize } from '../src/shared/shared'

describe('serialize', () => {
  test('to string', async () => {
    const audio = '/song.mp3'
    const recordedAt = new Date()
    const value = { audio, recordedAt }
    const serialized = serialize(value)
    // eslint-disable-next-line no-new-func
    expect(Function(`return ${serialized}`)()).toEqual(value)
  })
})
