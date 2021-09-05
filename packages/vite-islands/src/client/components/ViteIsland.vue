<script lang="ts">
import { defineComponent, h, createCommentVNode, createTextVNode } from 'vue'
import type { PropType, DefineComponent } from 'vue'
import { strategies } from '../../hydration'
import devalue from '@nuxt/devalue'

let idNumber = 0

export default defineComponent({
  name: 'ViteIsland',
  inheritAttrs: false,
  props: {
    component: { type: Object as PropType<DefineComponent>, required: true },
    componentName: { type: String, required: true },
    importName: { type: String, required: true },
    importPath: { type: String, required: true },
    'client:idle': { type: Boolean, default: false },
    'client:load': { type: Boolean, default: false },
    'client:visible': { type: Boolean, default: false },
    'client:only': { type: Boolean, default: false },
    'client:media': { type: String, default: '' },
  },
  setup () {
    return {
      id: `ile-${++idNumber}`,
    }
  },
  render () {
    const content = import.meta.env.SSR && this.$props['client:only']
      ? []
      : [h(this.component, this.$attrs, this.$slots)]
    const rootNode = h('ile-root', { id: this.id }, content)

    const strategy = strategies.find(st => (this.$props as any)[`client:${st}`]) || 'load'

    const props = { ...this.$attrs }
    if (strategy === 'media') props._mediaQuery = this['client:media']
    const script = `import { ${this.importName} as ${this.componentName} } from '${this.importPath}'
import { ${strategy} as hydrate } from '/src/logic/hydration'
hydrate(${this.componentName}, '${this.id}', ${devalue(props)}, /* ILE_HYDRATION_SLOTS */)
`

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
        return [
          createCommentVNode(`ILE_SLOT_BEGIN`),
          createTextVNode(slotName),
          createTextVNode(`ILE_SLOT_SEPARATOR`),
          slotFn(),
        ]
      }),
      createCommentVNode('ILE_HYDRATION_END'),
    ]
  },
})
</script>
