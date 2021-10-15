import { h, render, toChildArray } from 'preact'
import { renderToString } from 'preact-render-to-string'
import { Props, Slots } from './types'

type Component = any

/**
 * Preact doesn't have an equivalent for createStaticVNode.
 */
const IslandContent = (props: any) => {
  return h('iles-content', { dangerouslySetInnerHTML: { __html: props.content } })
}
IslandContent.shouldComponentUpdate = () => false

// Internal: Calls the function to run custom client code.
export default function createIsland (component: Component, id: string, el: Element, props: Props, slots: Slots | undefined) {
  const content = slots?.default
  const children = content ? toChildArray(h(IslandContent, { content })) : null

  if (import.meta.env.SSR)
    renderToString(h(component, { ...props, children, innerHTML: content }))
  else
    render(h(component, props, children), el)

  if (import.meta.env.DEV)
    (window as any).__ILE_DEVTOOLS__?.onHydration({ id, el, slots, component, framework: 'none' })
}
