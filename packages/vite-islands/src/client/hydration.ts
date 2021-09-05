import { h, defineComponent, createApp as createClientApp, createStaticVNode, createSSRApp } from 'vue'
import type { DefineComponent } from 'vue'

const createVueApp = import.meta.env.SSR ? createSSRApp : createClientApp

type Component = DefineComponent
type Props = Record<string, unknown>
type Slots = Record<string, string>

export enum Hydrate {
  WhenIdle = 'client:idle'
  OnLoad = 'client:load'
  MediaQuery = 'client:media'
  New = 'client:only'
  WhenVisible = 'client:visible'
}

let idNumber = 0

export function newHydrationId () {
  return `ile-${++idNumber}`
}

export function hydrationFn (strategy: HydrationStrategy) {
  switch (strategy) {
    case WhenIdle: return hydrateWhenIdle
    case OnLoad: return hydrateNow
    case MediaQuery: return hydrateOnMediaQuery
    case New: return mountNewApp
    case WhenVisible: return hydrateWhenVisible
  }
}

function createVueIsland (component: Component, el: Element, props: Props, slots: Slots) {
  if (slots)
    for (const slotName in slots)
      slots[slotName] = createStaticVNode(slots[slotName])

  createVueApp({ render: () => h(component, props, slots) })
    .mount(el!, Boolean(slots))
}

function createIsland (component: Component, id: string, props: Props, slots: Slots | undefined) {
  const name = component.__file?.split('/').reverse()[0]

  const el = document.getElementById(id)
  if (!el) return console.error(`Unable to find element #${id}, could not mount ${name}`)

  createVueIsland(component, el, props, slots)

  console.info(`Hydrated ${componentName}`, el, slots)
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
export default function hydrateWhenIdle (component: Component, id: string, props: Props, slots: Slots) {
  const whenIdle = 'requestIdleCallback' in window
    ? fn => requestIdleCallback(fn)
    : fn => setTimeout(fn, 200)

  whenIdle(() => hydrateNow(component, id, props, slots))
}

// Public: Hydrate this component when the specified media query is matched.
export default function hydrateOnMediaQuery (component: Component, id: string, { _mediaQuery, ...props }: Props, slots: Slots) {
  const mediaQuery = matchMedia(_mediaQuery)

  const onMediaMatch = mql.matches
    ? fn => fn()
    : fn => mediaQuery.addEventListener('change', fn, { once: true })

  onMediaMatch(() => hydrateNow(component, id, props, slots))
}

// Public: Hydrate this component when one of it's children becomes visible.
export default function hydrateWhenVisible (component: Component, id: string, props: Props, slots: Slots) {
  const observer = new IntersectionObserver(([{ isIntersecting }]) => {
    if (!isIntersecting) {
      observer.disconnect()
      hydrateNow(component, id, props, slots)
    }
  })

  // NOTE: Targets child elements since the root uses `display: contents`.
  document.getElementById(id).children.forEach(child => observer.observe(child))
}
