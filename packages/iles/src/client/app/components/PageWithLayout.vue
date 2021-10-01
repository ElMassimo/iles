<script lang="ts">
import { h, defineComponent } from 'vue'
import type { PropType } from 'vue'
import type { PageComponent } from '../../shared'

export default defineComponent({
  props: {
    page: { type: Object as PropType<PageComponent>, required: true },
  },
  render () {
    let vNode = h(this.page)
    let layout = this.page.layout
    while (layout) {
      const children = vNode
      vNode = h(layout, null, { default: () => children })
      layout = layout.layout
    }
    return vNode
  },
})
</script>
