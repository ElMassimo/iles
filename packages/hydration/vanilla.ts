import { Component, Props, Slots } from './types'

export type OnLoadFn = (el: Element, props: Props, slots: Slots | undefined) => void | Promise<void>

// Internal: Calls the function to run custom client code.
export default function createIsland (component: Component | OnLoadFn, id: string, el: Element, props: Props, slots: Slots | undefined) {
  if (typeof component === 'function')
    component(el, props, slots)

  if (import.meta.env.DEV)
    (window as any).__ILE_DEVTOOLS__?.onHydration({ id, el, props, slots, component, framework: 'none' })
}
