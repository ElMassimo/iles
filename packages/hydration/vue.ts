import { Component, Props, Slots } from './types'

import { h, createApp as createClientApp, createStaticVNode, createSSRApp } from 'vue'
import type { DefineComponent } from 'vue'

const createVueApp = import.meta.env.SSR ? createSSRApp : createClientApp

// Internal: Creates a Vue app and mounts it on the specified island root.
export default function createVueIsland (component: Component, id: string, el: Element, props: Props, slots: Slots | undefined) {
  const slotFns = slots && Object.fromEntries(Object.entries(slots).map(([slotName, content]) => {
    return [slotName, () => (createStaticVNode as any)(content)]
  }))

  createVueApp({ render: () => h(component, props, slotFns) })
    .mount(el!, Boolean(slots))

  if (import.meta.env.DEV)
    (window as any).__ILE_DEVTOOLS__?.onHydration({ id, el, slots, component })
}
