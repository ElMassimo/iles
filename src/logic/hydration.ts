import { h, defineComponent, createApp, createStaticVNode, createSSRApp } from 'vue'
import type { DefineComponent } from 'vue'

export const strategies = [
  'idle',
  'load',
  'visible',
  'media',
]

type Props = Record<string, unknown>
type Slots = Record<string, string>

const createIsland = import.meta.env.SSR ? createSSRApp : createApp

export function load (component: DefineComponent, id: string, props: Props, slots: Slots) {
  const el = document.getElementById(id)
  const slotFns = slots && Object.fromEntries(Object.entries(slots)
    .map(([name, str]) => [name, () => createStaticVNode(str)]))

  createIsland({
    render: () =>
      h(component, props, slotFns),
  })
    .mount(el!, true)
  console.log(`Hydrated ${component.__file?.split('/').reverse()[0]}`, el, slots)
}

export function idle (component: DefineComponent, id: string, props: Props, slots: Slots) {
  load(component, id, props, slots)
}
