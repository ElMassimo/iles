export { default as serialize } from '@nuxt/devalue'

export function uniq<T> (arr: Array<T>) {
  return [...new Set(arr.filter(x => x))]
}

export function escapeRegex (str: string) {
  return str.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')
}

export function pascalCase (str: string) {
  return capitalize(camelCase(str))
}

export function camelCase (str: string) {
  return str.replace(/[^\w_]+(\w)/g, (_, c) => c ? c.toUpperCase() : '')
}

export function capitalize (str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export async function replaceAsync (str: string, regex: RegExp, asyncFn: (...groups: string[]) => Promise<string>) {
  const promises = Array.from(str.matchAll(regex))
    .map(([match, ...args]) => asyncFn(match, ...args))
  const replacements = await Promise.all(promises)
  return str.replace(regex, () => replacements.shift()!)
}
