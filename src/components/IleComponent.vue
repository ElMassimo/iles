<script lang="ts">
import { defineComponent, h, createCommentVNode } from 'vue'
import type { PropType, DefineComponent } from 'vue'
import { strategies } from '~/logic/hydration'
import devalue from '@nuxt/devalue'

let idNumber = 0

export default defineComponent({
  name: 'IleComponent',
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

    const hydrationArg = strategy === 'media' ? `, ${this['client:media']}` : ''
    const script = `import { ${this.importName} as ${this.componentName} } from '${this.importPath}'
import { ${strategy} as hydrate } from '/src/logic/hydration'
hydrate(${this.componentName}, '${this.id}', ${devalue(this.$attrs)}${hydrationArg})
`

    if (!import.meta.env.SSR) {
      return [
        rootNode,
        h('script', { type: 'module', innerHTML: script }),
      ]
    }

    return !import.meta.env.SSR ? rootNode : [
      rootNode,
      createCommentVNode('ILE_HYDRATION_BEGIN'),
      script,
      createCommentVNode('ILE_HYDRATION_END'),
    ]
  },
})
</script>
