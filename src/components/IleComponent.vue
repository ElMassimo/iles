<script lang="ts">
import { defineComponent, h } from 'vue'
import type { DefineComponent } from 'vue'
import { useHead } from '@vueuse/head'

export default defineComponent({
  name: 'IleComponent',
  inheritAttrs: false,
  props: {
    component: { required: true },
    'client:idle': { type: Boolean, default: false },
    'client:load': { type: Boolean, default: false },
    'client:visible': { type: Boolean, default: false },
    'client:media': { type: String, default: '' },
    'client:only': { type: Boolean, default: false },
  },
  setup ({ component }) {
    useHead({
      script: [
        { type: 'module', 'client-keep': '', children: `console.log('Should hydrate ${component?.name}.')` }
      ]
    })
  },
  render () {
    const prerendered = h(this.component as DefineComponent, this.$attrs, this.$slots)
    return h('ile-root', null, prerendered)
  },
})
</script>
