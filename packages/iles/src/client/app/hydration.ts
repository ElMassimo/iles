import { useSSRContext } from 'vue'
import {
  hydrateWhenIdle,
  hydrateNow,
  hydrateOnMediaQuery,
  mountNewApp,
  hydrateWhenVisible,
} from '@islands/hydration'
import type { PrerenderFn } from '@islands/hydration'

let idNumber = 0

export function resetHydrationId () {
  idNumber = 0
}

export function newHydrationId () {
  if (import.meta.env.SSR) {
    const context = useSSRContext()
    context!.hydrationSerialNumber ||= 1
    return `ile-${context!.hydrationSerialNumber++}`
  }
  else {
    return `ile-${++idNumber}`
  }
}

export enum Hydrate {
  WhenIdle = 'client:idle',
  OnLoad = 'client:load',
  MediaQuery = 'client:media',
  SkipPrerender = 'client:only',
  WhenVisible = 'client:visible',
  None = 'client:static',
}

export const hydrationFns = {
  [Hydrate.WhenIdle]: hydrateWhenIdle.name,
  [Hydrate.OnLoad]: hydrateNow.name,
  [Hydrate.MediaQuery]: hydrateOnMediaQuery.name,
  [Hydrate.SkipPrerender]: mountNewApp.name,
  [Hydrate.WhenVisible]: hydrateWhenVisible.name,
  [Hydrate.None]: hydrateNow.name,
}

export const prerenderFns: Record<string, PrerenderFn> = {
  // preact: async () => (await import('@islands/hydration/preact')).prerender,
  async solid (component, props, slots) {
    // @ts-ignore
    const { ssr, renderToString, createComponent } = await import('solid-js/web')
    return renderToString(() => {
      const children = slots?.default && ssr(slots.default)
      return createComponent(component, { ...props, children })
    })
  },
  // svelte: async () => (await import('@islands/hydration/svelte')).prerender,
}
