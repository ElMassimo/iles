/* eslint-disable no-restricted-syntax */
export { inBrowser } from '../shared'
export { default as serialize } from '@nuxt/devalue'

export function mapObject<I, O> (obj: Record<string, I>, fn: (i: I, key?: string) => O): Record<string, O> {
  const result: Record<string, O> = {}
  for (let key in obj)
    result[key] = fn(obj[key], key)
  return result
}

export async function asyncMapObject<I, O> (obj: Record<string, I>, fn: (i: I) => Promise<O>): Promise<Record<string, O>> {
  const result: Record<string, O> = {}
  for (let key in obj)
    result[key] = await fn(obj[key])
  return result
}
