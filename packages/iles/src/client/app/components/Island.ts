import { createApp, defineComponent, h, useSlots, createCommentVNode, createTextVNode } from 'vue'
import type { PropType, DefineComponent } from 'vue'
import { renderToString } from '@vue/server-renderer'
import { serialize } from '../../shared'

let idNumber = 0

export function newHydrationId () {
  return `ile-${++idNumber}`
}

export enum Hydrate {
  WhenIdle = 'client:idle',
  OnLoad = 'client:load',
  MediaQuery = 'client:media',
  New = 'client:only',
  WhenVisible = 'client:visible',
}

export const hydrationFns = {
  [Hydrate.WhenIdle]: 'hydrateWhenIdle',
  [Hydrate.OnLoad]: 'hydrateNow',
  [Hydrate.MediaQuery]: 'hydrateOnMediaQuery',
  [Hydrate.New]: 'mountNewApp',
  [Hydrate.WhenVisible]: 'hydrateWhenVisible',
}

export default defineComponent({
  name: 'Island',
  inheritAttrs: false,
  props: {
    component: { type: Object as PropType<DefineComponent>, required: true },
    componentName: { type: String, required: true },
    importName: { type: String, required: true },
    importPath: { type: String, required: true },
    [Hydrate.WhenIdle]: { type: Boolean, default: false },
    [Hydrate.OnLoad]: { type: Boolean, default: false },
    [Hydrate.MediaQuery]: { type: [Boolean, String], default: false },
    [Hydrate.New]: { type: Boolean, default: false },
    [Hydrate.WhenVisible]: { type: Boolean, default: false },
  },
  async setup (props) {
    const slots = useSlots()
    const hydrateInDev = true

    const renderedSlots = import.meta.env.SSR || hydrateInDev ? Object.fromEntries(await Promise.all(Object.entries(slots).map(async ([name, slotFn]) => {
      const rendered = slotFn ? await renderToString(createApp(() => slotFn()), {}) : null
      return [name, rendered]
    }))) : []

    return {
      id: newHydrationId(),
      strategy: Object.values(Hydrate).find(s => props[s]) || Hydrate.OnLoad,
      renderedSlots,
      hydrateInDev,
    }
  },
  render () {
    const isSSR = import.meta.env.SSR

    const packageUrl = `${isSSR ? '' : '/@id/'}@islands/hydration`

    const content = isSSR && this.$props[Hydrate.New]
      ? []
      : [h(this.component, this.$attrs, this.$slots)]
    const rootNode = h('ile-root', { id: this.id, style: 'display: contents' }, content)

    const props = { ...this.$attrs }
    if (this.strategy === Hydrate.MediaQuery)
      props._mediaQuery = this.$props[Hydrate.MediaQuery]

    const script = `import { ${this.importName} as ${this.componentName} } from '${this.importPath}'
import { ${hydrationFns[this.strategy]} as hydrate } from '${packageUrl}'
hydrate(${this.componentName}, '${this.id}', ${serialize(props)}, ${serialize(this.renderedSlots)})
`

    // TEMPORARY, for debugging purposes.
    if (this.hydrateInDev) {
      return [
        rootNode,
        h('script', { type: 'module', innerHTML: script }),
      ]
    }

    return !isSSR ? rootNode : [
      rootNode,
      createCommentVNode('VITE_ISLAND_HYDRATION_BEGIN'),
      script,
      // ...Object.entries(this.$slots).flatMap(([slotName, slotFn]) => {
      //   return slotFn ? [
      //     createCommentVNode('VITE_ISLAND_SLOT_BEGIN'),
      //     createTextVNode(slotName),
      //     createTextVNode('VITE_ISLAND_SLOT_SEPARATOR'),
      //     slotFn(),
      //   ] : []
      // }),
      createCommentVNode('VITE_ISLAND_HYDRATION_END'),
    ]
  },
})
