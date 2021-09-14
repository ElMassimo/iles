import { createStaticVNode, h } from 'vue'

export function plainText (strings: TemplateStringsArray, ...values: unknown[]) {
  const text = values.reduce(
    (a: string, v: unknown, i: number) => a + v + strings[i + 1],
    Array.isArray(strings) ? strings[0] : strings,
  )
  return import.meta.env.SSR
    ? createStaticVNode(text, 0)
    : h('pre', null, h('code', null, text))
}
