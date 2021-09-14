import { useSSRContext } from 'vue'
import {
  hydrateWhenIdle,
  hydrateNow,
  hydrateOnMediaQuery,
  mountNewApp,
  hydrateWhenVisible,
} from '@islands/hydration'

let idNumber = 0

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
  New = 'client:only',
  WhenVisible = 'client:visible',
}

export const hydrationFns = {
  [Hydrate.WhenIdle]: hydrateWhenIdle.name,
  [Hydrate.OnLoad]: hydrateNow.name,
  [Hydrate.MediaQuery]: hydrateOnMediaQuery.name,
  [Hydrate.New]: mountNewApp.name,
  [Hydrate.WhenVisible]: hydrateWhenVisible.name,
}
