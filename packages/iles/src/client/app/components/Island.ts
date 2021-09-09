import { defineComponent, h, createCommentVNode, createTextVNode } from 'vue'
import type { PropType, DefineComponent } from 'vue'
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
  name: 'ViteIsland',
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
  setup (props) {
    return {
      id: newHydrationId(),
      strategy: Object.values(Hydrate).find(s => props[s]) || Hydrate.OnLoad,
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
hydrate(${this.componentName}, '${this.id}', ${serialize(props)}, /* VITE_ISLAND_HYDRATION_SLOTS */)
`

    // TEMPORARY, for debugging purposes.
    if (!isSSR && Object.keys(this.$slots).length === 0) {
      return [
        rootNode,
        h('script', { type: 'module', innerHTML: script }),
      ]
    }

    return !isSSR ? rootNode : [
      rootNode,
      createCommentVNode('VITE_ISLAND_HYDRATION_BEGIN'),
      script,
      ...Object.entries(this.$slots).flatMap(([slotName, slotFn]) => {
        return slotFn ? [
          createCommentVNode('VITE_ISLAND_SLOT_BEGIN'),
          createTextVNode(slotName),
          createTextVNode('VITE_ISLAND_SLOT_SEPARATOR'),
          slotFn(),
        ] : []
      }),
      createCommentVNode('VITE_ISLAND_HYDRATION_END'),
    ]
  },
})
