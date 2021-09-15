import { defineAsyncComponent } from 'vue'
import type { RouteLocationNormalizedLoaded } from 'vue-router'

const layouts = import.meta.glob('__LAYOUTS_ROOT__/**/*.vue')

export function getLayout ({ path, meta }: RouteLocationNormalizedLoaded) {
  if (meta.layout === false) return false

  const extIndex = path.lastIndexOf('.')
  if (extIndex > -1 && path.slice(extIndex) !== '.html') return false

  const layout = meta.layout || 'default'

  const layoutComponent = layouts[`__LAYOUTS_ROOT__/${layout}.vue`]
  if (layoutComponent) {
    const component = defineAsyncComponent(layoutComponent)
    component.name = `${layout}Layout`
    return component
  }

  if (layout === 'default') return (props: any, { slots }: any) => slots.default && slots.default()

  throw new Error(`Unknown layout '${layout}'. Should be defined in __LAYOUTS_ROOT__/${layout}.vue`)
}
