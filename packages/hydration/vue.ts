import { h, createStaticVNode, createSSRApp as createVueApp } from 'vue'
import type { DefineComponent as Component, Component as App } from 'vue'
import type { Props, Slots } from './types'
import { onDispose } from './hydration'
export { h }

// Internal: Creates a Vue app and mounts it on the specified island root.
export default function createVueIsland (component: Component, id: string, el: Element, props: Props, slots: Slots | undefined) {
  const slotFns = slotsToFns(slots)

  const appDefinition: App = { render: () => h(component, props, slotFns) }

  if (import.meta.env.DEV)
    appDefinition.name = `Island: ${nameFromFile(component.__file)}`

  const app = createVueApp(appDefinition)
  app.mount(el!)

  if (import.meta.env.DISPOSE_ISLANDS)
    onDispose(id, app.unmount)

  if (import.meta.env.DEV)
    (window as any).__ILE_DEVTOOLS__?.onHydration({ id, el, props, slots, component })
}

function nameFromFile (file?: string) {
  const regex = /(\w+?)(?:\.vue)?$/
  return file?.match(regex)?.[1] || file
}


export function slotsToFns (slots: Slots | undefined) {
  return slots && Object.fromEntries(Object.entries(slots).map(([slotName, content]) => {
    return [slotName, () => (createStaticVNode as any)(content)]
  }))
}
