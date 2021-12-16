import { h, createApp as createClientApp, createStaticVNode, createSSRApp } from 'vue'
import type { DefineComponent as Component } from 'vue'
import type { Props, Slots } from './types'
import { onDispose } from './hydration'

const createVueApp = import.meta.env.SSR ? createSSRApp : createClientApp

// Internal: Creates a Vue app and mounts it on the specified island root.
export default function createVueIsland (component: Component, id: string, el: Element, props: Props, slots: Slots | undefined) {
  const slotFns = slots && Object.fromEntries(Object.entries(slots).map(([slotName, content]) => {
    return [slotName, () => (createStaticVNode as any)(content)]
  }))

  const app = createVueApp({ render: () => h(component, props, slotFns) })
  app.mount(el!, Boolean(slots))

  if (import.meta.env.DISPOSE_ISLANDS)
    onDispose(id, app.unmount)

  if (import.meta.env.DEV)
    (window as any).__ILE_DEVTOOLS__?.onHydration({ id, el, props, slots, component })
}
