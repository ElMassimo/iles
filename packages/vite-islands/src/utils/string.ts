import { devalue } from '@nuxt/devalue'

export const serialize = devalue

export function escapeRegex (str: string) {
  return str.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')
}

export function pascalCase(str: string) {
  return capitalize(camelCase(str))
}

export function camelCase(str: string) {
  return str.replace(/[^\w_]+(\w)/g, (_, c) => (c ? c.toUpperCase() : ''))
}

export function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}
