import { h, createApp as createClientApp, createStaticVNode, createSSRApp } from 'vue'
import type { DefineComponent } from 'vue'

type Component = DefineComponent
type Props = Record<string, unknown>
type Slots = Record<string, string>

// Public: Hydrates the component immediately.
export function hydrateNow (component: Component, id: string, props: Props, slots: Slots) {
  createIsland(component, id, props, slots)
}

// Public: Mounts the component in an empty root, since the component was not
// statically rendered by the server.
export function mountNewApp (component: Component, id: string, props: Props) {
  createIsland(component, id, props)
}

// Public: Hydrate this component as soon as the main thread is free.
// If `requestIdleCallback` isn't supported, it uses a small delay.
export function hydrateWhenIdle (component: Component, id: string, props: Props, slots: Slots) {
  const whenIdle = 'requestIdleCallback' in window
    ? (fn: () => void) => (window as any).requestIdleCallback(fn)
    : (fn: () => void) => setTimeout(fn, 200)

  whenIdle(() => hydrateNow(component, id, props, slots))
}

// Public: Hydrate this component when the specified media query is matched.
export function hydrateOnMediaQuery (component: Component, id: string, props: Props, slots: Slots) {
  const mediaQuery = matchMedia(props._mediaQuery as string)
  delete props._mediaQuery

  const onMediaMatch = mediaQuery.matches
    ? (fn: () => void) => fn()
    : (fn: () => void) => mediaQuery.addEventListener('change', fn, { once: true })

  onMediaMatch(() => hydrateNow(component, id, props, slots))
}

// Public: Hydrate this component when one of it's children becomes visible.
export function hydrateWhenVisible (component: Component, id: string, props: Props, slots: Slots) {
  const observer = new IntersectionObserver(([{ isIntersecting }]) => {
    if (isIntersecting) {
      observer.disconnect()
      hydrateNow(component, id, props, slots)
    }
  })

  // NOTE: Targets child elements since the root uses `display: contents`.
  Array.from(document.getElementById(id)!.children)
    .forEach(child => observer.observe(child))
}

const createVueApp = import.meta.env.SSR ? createSSRApp : createClientApp

// Internal: Creates a Vue app and mounts it on the specified island root.
function createVueIsland (component: Component, id: string, el: Element, props: Props, slots: Slots | undefined) {
  const slotFns = slots && Object.fromEntries(Object.entries(slots).map(([slotName, content]) => {
    return [slotName, () => (createStaticVNode as any)(content)]
  }))

  createVueApp({ render: () => h(component, props, slotFns) })
    .mount(el!, Boolean(slots))

  if (import.meta.env.DEV)
    (window as any).__ILE_DEVTOOLS__?.onHydration({ id, el, slots, component })
}

// NOTE: In the future we might support mounting components from other frameworks.
function createIsland (component: Component, id: string, props: Props, slots?: Slots) {
  const el = document.getElementById(id)
  if (!el) return console.error(`Unable to find element #${id}, could not mount island.`)

  createVueIsland(component, id, el, props, slots)
}
