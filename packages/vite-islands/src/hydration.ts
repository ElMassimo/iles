import { h, defineComponent, createApp as createClientApp, createStaticVNode, createSSRApp } from 'vue'
import type { DefineComponent } from 'vue'

const createVueApp = typeof window !== 'undefined' ? createClientApp : createSSRApp

type Component = DefineComponent
type Props = Record<string, unknown>
type Slots = Record<string, string>

let idNumber = 0

export function newHydrationId () {
  return `ile-${++idNumber}`
}

function createVueIsland (component: Component, el: Element, props: Props, slots: Slots | undefined) {
  const slotFns = slots && Object.fromEntries(Object.entries(slots).map(([slotName, content]) => {
    return [slotName, () => (createStaticVNode as any)(content)]
  }))

  createVueApp({ render: () => h(component, props, slotFns) })
    .mount(el!, Boolean(slots))
}

function createIsland (component: Component, id: string, props: Props, slots?: Slots) {
  const name = component.__file?.split('/').reverse()[0]

  const el = document.getElementById(id)
  if (!el) return console.error(`Unable to find element #${id}, could not mount ${name}`)

  createVueIsland(component, el, props, slots)

  console.info(`Hydrated ${name}`, el, slots)
}

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
export function hydrateOnMediaQuery (component: Component, id: string, { _mediaQuery, ...props }: Props, slots: Slots) {
  const mediaQuery = matchMedia(_mediaQuery as string)

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
