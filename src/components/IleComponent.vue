<script lang="ts">
import { defineComponent, h, createCommentVNode } from 'vue'
import type { DefineComponent } from 'vue'
import { strategies } from '~/logic/hydration'
import devalue from '@nuxt/devalue'

let idNumber = 0

export default defineComponent({
  name: 'IleComponent',
  inheritAttrs: false,
  props: {
    ileIs: { required: true },
    ileFile: { required: true },
    'client:idle': { type: Boolean, default: false },
    'client:load': { type: Boolean, default: false },
    'client:visible': { type: Boolean, default: false },
    'client:media': { type: String, default: '' },
  },
  setup () {
    return {
      id: `ile-${++idNumber}`,
    }
  },
  render () {
    const content = [h(this.ileIs as DefineComponent, this.$attrs, this.$slots)]
    const rootNode = h('ile-root', { id: this.id }, content)

    const strategy = strategies.find(st => this.$props[`client:${st}`]) || 'load'

    const script =
`import c from '${this.ileFile}'
import { ${strategy} as hydrate } from '/src/logic/hydration'
hydrate(c, '${this.id}', ${devalue(this.$attrs)}${ strategy === 'media' ? this['client:media'] : '' })`

    return !import.meta.env.SSR ? rootNode : [
      rootNode,
      createCommentVNode('ILE_HYDRATION_BEGIN'),
      script,
      createCommentVNode('ILE_HYDRATION_END'),
    ]
  },
})
</script>
