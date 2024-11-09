import { createRawSnippet, mount, unmount, type Snippet } from 'svelte'
import type { Props, Slots } from './types'
import { onDispose } from './hydration'

type Component = any

export default function createIsland (Component: Component, id: string, el: Element, props: Props, slots: Slots | undefined = {}) {
  let children = undefined
  let $$slots: Record<string, Snippet> & { default?: boolean } | undefined = undefined
  let renderFns: Record<string, Snippet> = {}

  Object.entries(slots).forEach(([slotName, html]) => {
    const fnName = slotName === 'default' ? 'children' : slotName
    renderFns[fnName] = createRawSnippet(() => ({ render: () => html }))

    $$slots ??= {}
    if (slotName === 'default') {
      $$slots.default = true
      children = renderFns[fnName]
    } else {
      $$slots[fnName] = renderFns[fnName]
    }
  })

  // eslint-disable-next-line no-new, new-cap
  const component = mount(Component, {
    target: el,
    props: {
      ...props,
      children,
      $$slots,
      ...renderFns,
    },
  });

  if (import.meta.env.DISPOSE_ISLANDS)
    onDispose(id, () => unmount(component))

  if (import.meta.env.DEV)
    (window as any).__ILE_DEVTOOLS__?.onHydration({ id, el, props, slots, component, framework: 'svelte' })
}
