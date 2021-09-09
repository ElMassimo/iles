import { defineAsyncComponent } from 'vue'
import type { RouteLocationNormalizedLoaded } from 'vue-router'

const layouts = import.meta.glob('__LAYOUTS_ROOT__/**/*.vue')

export function getLayout (route: RouteLocationNormalizedLoaded) {
  const name = route.meta.layout ?? 'default'
  const layout = layouts[`__LAYOUTS_ROOT__/${name}.vue`]
  if (layout) return defineAsyncComponent(layout)

  if (name === 'default') return (props: any, { slots }: any) => slots.default && slots.default()

  throw new Error(`Unknown layout '${name}'. Should be defined in __LAYOUTS_ROOT__/${name}.vue`)
}
