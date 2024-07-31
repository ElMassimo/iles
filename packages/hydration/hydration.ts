import type { AsyncComponent, AsyncFrameworkFn, Component, FrameworkFn, Props, Slots } from './types'

export { Framework, Props, Slots } from './types'

const findById = (id: string) =>
  document.getElementById(id) || console.error(`Missing #${id}, could not mount island.`)

// Public: Hydrates the component immediately.
export function hydrateNow(framework: FrameworkFn, component: Component, id: string, props: Props, slots: Slots) {
  const el = findById(id)
  if (el) {
    framework(component, id, el, props, slots)
    el.setAttribute('hydrated', '')
  }
}

async function resolveAndHydrate(frameworkFn: AsyncFrameworkFn, componentFn: AsyncComponent, id: string, props: Props, slots: Slots) {
  const [framework, component] = await Promise.all([frameworkFn(), componentFn()])
  hydrateNow(framework, component, id, props, slots)
}

// Internal: Invoked before navigation when turbo is enabled, or before HMR.
export const onDispose = (id: string, fn: () => void) =>
  (window as any).__ILE_DISPOSE__?.set(id, fn)

// Public: Hydrate this component as soon as the main thread is free.
// If `requestIdleCallback` isn't supported, it uses a small delay.
export function hydrateWhenIdle(framework: AsyncFrameworkFn, component: AsyncComponent, id: string, props: Props, slots: Slots) {
  const whenIdle = window.requestIdleCallback || setTimeout
  const cancelIdle = window.cancelIdleCallback || clearTimeout

  const idleId: any = whenIdle(() =>
    resolveAndHydrate(framework, component, id, props, slots))

  if (import.meta.env.DISPOSE_ISLANDS) { onDispose(id, () => cancelIdle(idleId)) }
}

// Public: Hydrate this component when the specified media query is matched.
export function hydrateOnMediaQuery(framework: AsyncFrameworkFn, component: AsyncComponent, id: string, props: Props, slots: Slots) {
  const mediaQuery = matchMedia(props._mediaQuery as string)
  delete props._mediaQuery

  const onChange = (fn: any = null) => mediaQuery.onchange = fn

  const hydrate = () => {
    onChange()
    resolveAndHydrate(framework, component, id, props, slots)
  }

  if (mediaQuery.matches) {
    hydrate()
  }
  else {
    onChange(hydrate)
  }

  if (import.meta.env.DISPOSE_ISLANDS) { onDispose(id, onChange) }
}

// Public: Hydrate this component when one of it's children becomes visible.
export function hydrateWhenVisible(framework: AsyncFrameworkFn, component: AsyncComponent, id: string, props: Props, slots: Slots) {
  const el = findById(id)
  if (el) {
    // NOTE: Force detection of the element for non-Vue frameworks.
    if (import.meta.env.DEV) { el.style.display = 'initial' }

    const observer = new IntersectionObserver(([{ isIntersecting }]) => {
      if (isIntersecting) {
        // eslint-disable-next-line ts/no-use-before-define
        stopObserver()

        // NOTE: Reset the display value.
        if (import.meta.env.DEV) { el.style.display = '' }

        resolveAndHydrate(framework, component, id, props, slots)
      }
    })
    const stopObserver = () => observer.disconnect()

    observer.observe(el)

    if (import.meta.env.DISPOSE_ISLANDS) { onDispose(id, stopObserver) }
  }
}
