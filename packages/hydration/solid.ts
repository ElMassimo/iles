// @ts-ignore
import { hydrate } from 'solid-js/web/dist/web.js'
import { renderToString, ssr, createComponent } from 'solid-js/web'
import type { Component } from 'solid-js'
import { Props, Slots, PrerenderFn } from './types'

export default function createIsland (component: Component, id: string, el: Element, props: Props, slots: Slots | undefined) {
  // @ts-ignore
  window._$HYDRATION ||= { events: [], completed: new WeakSet() }
  hydrate(() => createElement(component, props, slots), el)

  if (import.meta.env.DEV)
    (window as any).__ILE_DEVTOOLS__?.onHydration({ id, el, slots, component, framework: 'solid' })
}

export const prerender: PrerenderFn = (component, props, slots) =>
  `<script>window._$HYDRATION||(window._$HYDRATION={events:[],completed:new WeakSet()})</script>${
    renderToString(() => createElement(component, props, slots))
  }`

function createContent (slots: Slots | undefined) {
  if (!slots)
    return undefined

  if (import.meta.env.SSR)
    return ssr(`<iles-content>${slots?.default}</iles-content>`)

  const content = document.createElement('iles-content')
  content.innerHTML = slots?.default
  return content
}

function createElement (component: Component, props: Props, slots: Slots | undefined) {
  const children = createContent(slots) as any
  return createComponent(component, { ...props, children })
}
