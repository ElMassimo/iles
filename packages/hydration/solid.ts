import { createComponent, hydrate, render } from 'solid-js/web'
import type { Component } from 'solid-js'
import type { Props, Slots } from './types'
import { onDispose } from './hydration'

export default function createIsland(component: Component, id: string, el: Element, props: Props, slots: Slots | undefined) {
  if (import.meta.env.DEV) {
    // eslint-disable-next-line ts/ban-ts-comment
  // @ts-ignore
    window._$HY ||= { events: [], completed: new WeakSet(), r: {} }
  }

  const dispose = (import.meta.env.DEV ? render : hydrate)(() => createComponent(component, { ...props, children: createContent(slots) }), el, { renderId: id })

  if (import.meta.env.DISPOSE_ISLANDS) { onDispose(id, dispose) }

  if (import.meta.env.DEV) { (window as any).__ILE_DEVTOOLS__?.onHydration({ id, el, props, slots, component, framework: 'solid' }) }
}

function createContent(slots: Slots | undefined) {
  if (!slots?.default) { return }
  const content = document.createElement('iles-content')
  content.innerHTML = slots.default
  return Array.from(content.childNodes)
}
