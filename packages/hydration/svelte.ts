import { create_ssr_component, missing_component, validate_component } from 'svelte/internal'
// @ts-ignore
import SvelteComponent from './SvelteWrapper'
// @ts-ignore
import SvelteSSR from './svelte-ssr'
import { Props, Slots, PrerenderFn } from './types'

type Component = any

export default function createIsland (component: Component, id: string, el: Element, props: Props, slots: Slots | undefined = {}) {
  // eslint-disable-next-line no-new
  new SvelteComponent({ el, props: { component, slots, props }, hydrate: true })

  if (import.meta.env.DEV)
    (window as any).__ILE_DEVTOOLS__?.onHydration({ id, el, slots, component, framework: 'svelte' })
}

export const prerender: PrerenderFn = (component, props, slots) =>
  SvelteSSR.render({ component, slots, props })
