import { createApp as createClientApp, createSSRApp, createStaticVNode, h } from 'vue'
import type { Component as App, DefineComponent as Component } from 'vue'
import type { EnhanceIslands, Props, Slots } from './types'
import { onDispose } from './hydration'

const createVueApp = import.meta.env.SSR ? createSSRApp : createClientApp

// Internal: Creates a Vue app and mounts it on the specified island root.
export default async function createVueIsland(component: Component, id: string, el: Element, props: Props, slots: Slots | undefined, enhanceIslands: EnhanceIslands) {
  const slotFns = slots && Object.fromEntries(Object.entries(slots).map(([slotName, content]) => {
    return [slotName, () => (createStaticVNode as any)(content)]
  }))

  const appDefinition: App = { render: () => h(component, props, slotFns) }

  if (import.meta.env.DEV) { appDefinition.name = `Island: ${nameFromFile(component.__file)}` }

  const app = createVueApp(appDefinition)
  if (enhanceIslands) {
    await enhanceIslands({ app })
  }

  app.mount(el!, Boolean(slots))

  if (import.meta.env.DISPOSE_ISLANDS) { onDispose(id, app.unmount) }

  if (import.meta.env.DEV) { (window as any).__ILE_DEVTOOLS__?.onHydration({ id, el, props, slots, component }) }
}

function nameFromFile(file?: string) {
  const regex = /(\w+)(?:\.vue)?$/
  return file?.match(regex)?.[1] || file
}
