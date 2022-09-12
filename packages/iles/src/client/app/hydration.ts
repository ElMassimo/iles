import { useSSRContext } from 'vue'
import {
  hydrateWhenIdle,
  hydrateNow,
  hydrateOnMediaQuery,
  hydrateWhenVisible,
} from '@islands/hydration'

export function newHydrationId () {
  if (import.meta.env.SSR) {
    const context = useSSRContext()
    context!.hydrationSerialNumber ||= 1
    return `ile-${context!.hydrationSerialNumber++}`
  }
  else if (import.meta.env.DEV) {
    return (window as any).__ILE_DEVTOOLS__.nextIslandId()
  }
}

export enum Hydrate {
  WhenIdle = 'client:idle',
  OnLoad = 'client:load',
  MediaQuery = 'client:media',
  SkipPrerender = 'client:only',
  WhenVisible = 'client:visible',
  None = 'client:none',
}

export const hydrationFns = {
  [Hydrate.WhenIdle]: hydrateWhenIdle.name,
  [Hydrate.OnLoad]: hydrateNow.name,
  [Hydrate.MediaQuery]: hydrateOnMediaQuery.name,
  [Hydrate.SkipPrerender]: hydrateNow.name,
  [Hydrate.WhenVisible]: hydrateWhenVisible.name,
  [Hydrate.None]: hydrateNow.name,
}

// Internal: Strategies that will hydrate instantly and don't need dynamic imports.
export function isEager (strategy: string) {
  return strategy === Hydrate.OnLoad || strategy === Hydrate.SkipPrerender || strategy === Hydrate.None
}
