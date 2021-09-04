import { createApp } from 'vue'
import type { Component } from 'vue'

export const strategies = [
  'idle',
  'load',
  'visible',
  'media',
]

type Props = Record<string, unknown>

export function load (component: Component, id: string, props: Props) {
  const el = document.getElementById(id)
  createApp(component, props).mount(el, true)
  console.log(`Hydrated ${component.__file?.split('/').reverse()[0]}`, el)
}

export function idle (component: Component, id: string, props: Props) {
  load(component, id, props)
}
