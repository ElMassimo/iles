import { AsyncFrameworkFn, FrameworkFn, Component, AsyncComponent, Props, Slots } from './types'
export { Framework, Props, Slots } from './types'

const whenIdle = !import.meta.env.SSR && window.requestIdleCallback || setTimeout
const cancelIdle = !import.meta.env.SSR && window.cancelIdleCallback || clearTimeout

const findById = (id: string) =>
  document.getElementById(id) || console.error(`Missing #${id}, could not mount island.`)

// Public: Hydrates the component immediately.
export function hydrateNow (framework: FrameworkFn, component: Component, id: string, props: Props, slots: Slots) {
  const el = findById(id)
  if (el) framework(component, id, el, props, slots)
}

async function resolveAndHydrate (frameworkFn: AsyncFrameworkFn, componentFn: AsyncComponent, id: string, props: Props, slots: Slots) {
  const [framework, component] = await Promise.all([frameworkFn(), componentFn()])
  hydrateNow(framework, component, id, props, slots)
}

// Public: Hydrate this component as soon as the main thread is free.
// If `requestIdleCallback` isn't supported, it uses a small delay.
export function hydrateWhenIdle (framework: AsyncFrameworkFn, component: AsyncComponent, id: string, props: Props, slots: Slots) {
  const idleId: any = whenIdle(() =>
    resolveAndHydrate(framework, component, id, props, slots))

  if (import.meta.env.DISPOSE_ISLANDS)
    onDispose(id, () => cancelIdle(idleId))
}

// Public: Hydrate this component when the specified media query is matched.
export function hydrateOnMediaQuery (framework: AsyncFrameworkFn, component: AsyncComponent, id: string, props: Props, slots: Slots) {
  const mediaQuery = matchMedia(props._mediaQuery as string)
  delete props._mediaQuery

  const onChange = (fn: any = null) => mediaQuery.onchange = fn

  const hydrate = () => {
    onChange()
    resolveAndHydrate(framework, component, id, props, slots)
  }

  mediaQuery.matches ? hydrate() : onChange(hydrate)

  if (import.meta.env.DISPOSE_ISLANDS)
    onDispose(id, onChange)
}

// Public: Hydrate this component when one of it's children becomes visible.
export function hydrateWhenVisible (framework: AsyncFrameworkFn, component: AsyncComponent, id: string, props: Props, slots: Slots) {
  const el = findById(id)
  if (el) {
    const observer = new IntersectionObserver(([{ isIntersecting }]) => {
      if (isIntersecting) {
        stopObserver()
        resolveAndHydrate(framework, component, id, props, slots)
      }
    })
    const stopObserver = () => observer.disconnect()

    // NOTE: Targets child elements since the root uses `display: contents`.
    Array.from(el.children).forEach(child => observer.observe(child))

    if (import.meta.env.DISPOSE_ISLANDS)
      onDispose(id, stopObserver)
  }
}

// Internal: Invoked before navigation when turbo is enabled, or before HMR.
export const onDispose = (id: string, fn: () => void) =>
  (window as any).__ILE_DISPOSE__?.set(id, fn)
