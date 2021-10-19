import { AsyncFrameworkFn, FrameworkFn, Component, AsyncComponent, Props, Slots } from './types'
export { Framework, Props, Slots } from './types'

// Public: Hydrates the component immediately.
export function hydrateNow (framework: FrameworkFn, component: Component, id: string, props: Props, slots: Slots) {
  const el = document.getElementById(id)
  if (!el) return console.error(`Missing #${id}, could not mount island.`)

  framework(component, id, el, props, slots)
}

async function resolveAndHydrate (frameworkFn: AsyncFrameworkFn, componentFn: AsyncComponent, id: string, props: Props, slots: Slots) {
  const [framework, component] = await Promise.all([frameworkFn(), componentFn()])
  hydrateNow(framework, component, id, props, slots)
}

// Public: Hydrate this component as soon as the main thread is free.
// If `requestIdleCallback` isn't supported, it uses a small delay.
export function hydrateWhenIdle (framework: AsyncFrameworkFn, component: AsyncComponent, id: string, props: Props, slots: Slots) {
  const whenIdle = 'requestIdleCallback' in window
    ? (fn: () => void) => (window as any).requestIdleCallback(fn)
    : (fn: () => void) => setTimeout(fn, 200)

  whenIdle(() => resolveAndHydrate(framework, component, id, props, slots))
}

// Public: Hydrate this component when the specified media query is matched.
export function hydrateOnMediaQuery (framework: AsyncFrameworkFn, component: AsyncComponent, id: string, props: Props, slots: Slots) {
  const mediaQuery = matchMedia(props._mediaQuery as string)
  delete props._mediaQuery

  const onMediaMatch = mediaQuery.matches
    ? (fn: () => void) => fn()
    : (fn: () => void) => mediaQuery.addEventListener('change', fn, { once: true })

  onMediaMatch(() => resolveAndHydrate(framework, component, id, props, slots))
}

// Public: Hydrate this component when one of it's children becomes visible.
export function hydrateWhenVisible (framework: AsyncFrameworkFn, component: AsyncComponent, id: string, props: Props, slots: Slots) {
  const observer = new IntersectionObserver(([{ isIntersecting }]) => {
    if (isIntersecting) {
      observer.disconnect()
      resolveAndHydrate(framework, component, id, props, slots)
    }
  })

  // NOTE: Targets child elements since the root uses `display: contents`.
  Array.from(document.getElementById(id)!.children)
    .forEach(child => observer.observe(child))
}
