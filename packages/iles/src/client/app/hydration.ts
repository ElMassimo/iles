import { useSSRContext } from 'vue'
import {
  hydrateWhenIdle,
  hydrateNow,
  hydrateOnMediaQuery,
  hydrateWhenVisible,
} from '@islands/hydration'

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
  [Hydrate.SkipPrerender]: hydrateNow.name,
  [Hydrate.WhenVisible]: hydrateWhenVisible.name,
}
