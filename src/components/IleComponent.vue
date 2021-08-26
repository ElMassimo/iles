<script lang="ts">
import { defineComponent, h } from 'vue'
import type { DefineComponent } from 'vue'
import { useHead } from '@vueuse/head'
import devalue from '@nuxt/devalue'

let idNumber = 0

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
  async setup ({ component }) {
    const name = component?.name || 'AudioPlayer'
    const id = `island-${++idNumber}`
    return {
      id,
      name,
    }
  },
  render () {
    const prerendered = [h(this.component as DefineComponent, this.$attrs, this.$slots)]

    if (import.meta.env.SSR)
      prerendered.push(h('script', { type: 'module', 'client-keep': '', innerHTML: `
        import '/assets/components/${this.name}.js'
        ${this.name}('${this.id}', ${devalue(this.$attrs)})
      ` }))
    return h('ile-root', { id: this.id }, prerendered)
  },
})
</script>
