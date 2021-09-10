import { createSSRApp, defineAsyncComponent, defineComponent, h, createCommentVNode, createTextVNode } from 'vue'
import type { PropType, DefineComponent } from 'vue'
import { renderToString } from '@vue/server-renderer'
import { serialize } from '../utils'
import { newHydrationId, Hydrate, hydrationFns } from '../hydration'

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
    return {
      id: newHydrationId(),
      strategy: Object.values(Hydrate).find(s => props[s]) || Hydrate.OnLoad,
      hydrateInDev: true,
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

    const slotVNodes = Object.entries(this.$slots)
      .map(([name, slotFn]) => [name, slotFn?.()])

    const renderScript = async () => {
      if (!import.meta.env.SSR && !this.hydrateInDev) return ''

      const promises = slotVNodes.map(async ([name, slotVNode]) =>
        [name, await renderToString(createSSRApp(() => slotVNode), {})])

      const renderedSlots = Object.fromEntries(await Promise.all(promises))

      return `import { ${this.importName} as ${this.componentName} } from '${this.importPath}'
  import { ${hydrationFns[this.strategy]} as hydrate } from '${packageUrl}'
  hydrate(${this.componentName}, '${this.id}', ${serialize(props)}, ${serialize(renderedSlots)})
  `
    }

    // TEMPORARY, for debugging purposes.
    if (this.hydrateInDev) {
      return [
        rootNode,
        h(defineAsyncComponent(async () => h('script', { type: 'module', innerHTML: await renderScript() }))),
      ]
    }

    return !isSSR ? rootNode : [
      rootNode,
      createCommentVNode('VITE_ISLAND_HYDRATION_BEGIN'),
      h(defineAsyncComponent(async () => createTextVNode(await renderScript()))),
      createCommentVNode('VITE_ISLAND_HYDRATION_END'),
    ]
  },
})
