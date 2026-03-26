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

export function getComponentName ({ displayName, name, _componentTag, __file }: any) {
  return displayName || name || _componentTag || nameFromFile(__file)
}

function nameFromFile (file: string) {
  const regex = /[\\/]src(?:[\\/](?:pages|layouts))?[\\/](.*?)(?:\.vue)?$/
  return file?.match(regex)?.[1] || file
}
