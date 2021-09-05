<script lang="ts">
import { defineComponent, h, createCommentVNode, createTextVNode } from 'vue'
import type { PropType, DefineComponent } from 'vue'
import { newHydrationId, hydrationFn, Hydrate } from '../hydration'
import { serialize } from '../../utils/string'

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
    [Hydrate.MediaQuery]: { type: Boolean, default: false },
    [Hydrate.New]: { type: Boolean, default: false },
    [Hydrate.WhenVisible]: { type: String, default: '' },
  },
  setup (props) {
    return {
      id: newHydrationId(),
      strategy: Object.values(Hydrate).find(s => props[s])
        || Hydrate.OnLoad,
    }
  },
  render () {
    const content = import.meta.env.SSR && this.$props[Hydrate.New]
      ? []
      : [h(this.component, this.$attrs, this.$slots)]
    const rootNode = h('ile-root', { id: this.id, style: 'display: contents' }, content)

    const props = { ...this.$attrs }
    if (this.strategy === Hydrate.MediaQuery)
      props._mediaQuery = this.$props[Hydrate.MediaQuery]

    const script = `import { ${this.importName} as ${this.componentName} } from '${this.importPath}'
import { ${hydrationFn(this.strategy)} as hydrate } from '/src/logic/hydration'
hydrate(${this.componentName}, '${this.id}', ${serialize(props)}, /* ILE_HYDRATION_SLOTS */)
`

    // TEMPORARY, for debugging purposes.
    if (!import.meta.env.SSR && Object.keys(this.$slots).length === 0) {
      return [
        rootNode,
        h('script', { type: 'module', innerHTML: script }),
      ]
    }

    return !import.meta.env.SSR ? rootNode : [
      rootNode,
      createCommentVNode('ILE_HYDRATION_BEGIN'),
      script,
      ...Object.entries(this.$slots).flatMap(([slotName, slotFn]) => {
        return slotFn ? [
          createCommentVNode(`ILE_SLOT_BEGIN`),
          createTextVNode(slotName),
          createTextVNode(`ILE_SLOT_SEPARATOR`),
          slotFn(),
        ] : []
      }),
      createCommentVNode('ILE_HYDRATION_END'),
    ]
  },
})
</script>
