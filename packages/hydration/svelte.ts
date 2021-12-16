import { HtmlTag, empty, insert, detach } from 'svelte/internal'
import type { Props, Slots } from './types'
import { onDispose } from './hydration'

type Component = any

export default function createIsland (component: Component, id: string, el: Element, props: Props, slots: Slots | undefined = {}) {
  const $$slots = slots && Object.fromEntries(Object.entries(slots).map(([slotName, content]) => {
    return [slotName, [() => createSlot(content)]]
  }))

  // eslint-disable-next-line no-new, new-cap
  const app = new component({ target: el, props: { ...props, $$slots, $$scope: { ctx: {} } }, hydrate: true })

  if (import.meta.env.DISPOSE_ISLANDS)
    onDispose(id, app.$destroy)

  if (import.meta.env.DEV)
    (window as any).__ILE_DEVTOOLS__?.onHydration({ id, el, props, slots, component, framework: 'svelte' })
}

// Internal: A custom function to provide rendered content for Svelte slots.
function createSlot (raw_value: string) {
  let html_tag = new HtmlTag()
  const c = () => {
    html_tag = new HtmlTag()
    Object.assign(html_tag, { a: empty() })
  }
  c()

  return {
    c,
    l () {},
    m (target: HTMLElement, anchor: HTMLElement) {
      html_tag.m(raw_value, target, anchor)
      insert(target, html_tag.a, anchor)
    },
    p () {},
    d (detaching: boolean) {
      if (detaching) detach(html_tag.a)
      if (detaching) html_tag.d()
    },
  }
}
