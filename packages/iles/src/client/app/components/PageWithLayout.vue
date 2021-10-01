<script lang="ts">
import { h, defineComponent } from 'vue'
import { usePage } from 'iles'

export default defineComponent({
  setup () {
    return usePage()
  },
  watch: {
    page (page, oldPage) {
      console.log('watch', { page, oldPage })
    },
  },
  render () {
    let vNode = h(this.page)
    let layout = this.page.layout
    console.log({ layout: layout && layout.name })
    while (layout) {
      const children = vNode
      vNode = h(layout, null, { default: () => children })
      layout = layout.layout
    }
    return vNode
  },
})
</script>
