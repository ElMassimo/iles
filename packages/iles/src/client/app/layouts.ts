import { defineAsyncComponent } from 'vue'
import type { LayoutFactory } from '../shared'

const layouts = import.meta.glob('__LAYOUTS_ROOT__/**/*.vue')

export const getLayout: LayoutFactory = (name: string | false) => {
  if (name === false) return false

  const layout = layouts[`__LAYOUTS_ROOT__/${name}.vue`]
  if (layout)
    return defineAsyncComponent(() => layout().then(m => m.default))

  // If no default layout is defined, render the page by itself.
  if (name === 'default')
    return (props: any, { slots }: any) => slots.default && slots.default()

  throw new Error(`Unknown layout '${name}'. Should be defined in __LAYOUTS_ROOT__/${name}.vue`)
}
