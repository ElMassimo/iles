import { h, render, toChildArray } from 'preact'
import type { FunctionComponent as Component } from 'preact'
import { Props, Slots } from './types'

export default function createIsland (component: Component, id: string, el: Element, props: Props, slots: Slots | undefined) {
  render(createElement(component, props, slots), el)

  if (import.meta.env.DEV)
    (window as any).__ILE_DEVTOOLS__?.onHydration({ id, el, props, slots, component, framework: 'preact' })
}

/**
 * Preact doesn't have an equivalent for createStaticVNode.
 */
const IslandContent = (props: any) => {
  return h('iles-content', { dangerouslySetInnerHTML: { __html: props.content } })
}
IslandContent.shouldComponentUpdate = () => false

export function createElement (component: Component, props: Props, slots: Slots | undefined) {
  const content = slots?.default
  const children = content ? toChildArray(h(IslandContent, { content })) : null
  return h(component, props, children)
}
