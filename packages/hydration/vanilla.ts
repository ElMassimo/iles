import { Component, Props, Slots } from './types'

type MaybeAsync<T> = T | Promise<T>
export type OnDisposeFn = () => void
export type OnLoadFn = (el: Element, props: Props, slots: Slots | undefined) => MaybeAsync<void | OnDisposeFn>

const isFunction = (val: any): val is Function => typeof val === 'function'

// Internal: Calls the function to run custom client code.
export default async function createIsland (component: Component | OnLoadFn, id: string, el: Element, props: Props, slots: Slots | undefined) {
  if (isFunction(component)) {
    const dispose = await component(el, props, slots)

    if (import.meta.env.DISPOSE_ISLANDS && isFunction(dispose))
      (window as any).__ILE_DISPOSE__?.set(id, dispose)
  }

  if (import.meta.env.DEV)
    (window as any).__ILE_DEVTOOLS__?.onHydration({ id, el, props, slots, component, framework: 'none' })
}
