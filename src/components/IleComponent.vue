<script lang="ts">
import { defineComponent, h } from 'vue'
import type { DefineComponent } from 'vue'

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
  render () {
    return h('ile-root', null,
      h(this.component as DefineComponent, this.$attrs, this.$slots))
  },
})
</script>
