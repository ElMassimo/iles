import { defineAsyncComponent } from 'vue'
import type { RouteLocationNormalizedLoaded } from 'vue-router'

const layouts = import.meta.glob('__LAYOUTS_ROOT__/**/*.vue')

export function getLayout ({ path, meta }: RouteLocationNormalizedLoaded) {
  const extIndex = path.lastIndexOf('.')
  if (extIndex > -1 && path.slice(extIndex) !== '.html') return false

  const name = meta.frontmatter?.layout ?? meta.layout ?? 'default'
  if (name === false) return false

  const layout = layouts[`__LAYOUTS_ROOT__/${name}.vue`]
  if (layout) {
    const component = defineAsyncComponent(layout)
    component.name = `${name}Layout`
    return component
  }

  if (name === 'default') return (props: any, { slots }: any) => slots.default && slots.default()

  throw new Error(`Unknown layout '${name}'. Should be defined in __LAYOUTS_ROOT__/${name}.vue`)
}
