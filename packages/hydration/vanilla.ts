import { Component, Props, Slots } from './types'

// Internal: Calls the function to run custom client code.
export default function createIsland (component: Component | Function, id: string, el: Element, props: Props, slots: Slots | undefined) {
  if (typeof component === 'function')
    component(id, el, props, slots)

  if (import.meta.env.DEV)
    (window as any).__ILE_DEVTOOLS__?.onHydration({ id, el, slots, component, framework: 'none' })
}
