import { createVaporApp } from 'vue/vapor'
import type { Props, Slots } from './types'
import { onDispose } from './hydration'

// Internal: Creates a Vue Vapor app and mounts it on the specified island root.
// Vapor islands bypass the virtual DOM for significantly smaller bundle size.
export default function createVueVaporIsland (component: any, id: string, el: Element, props: Props, slots: Slots | undefined) {
  const app = createVaporApp(component, {
    ...props,
    ...slots && Object.fromEntries(Object.entries(slots).map(([slotName, content]) => {
      return [slotName, () => content]
    })),
  })

  app.mount(el!)

  if (import.meta.env.DISPOSE_ISLANDS)
    onDispose(id, app.unmount)

  if (import.meta.env.DEV)
    (window as any).__ILE_DEVTOOLS__?.onHydration({ id, el, props, slots, component })
}
