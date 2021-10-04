<script lang="ts">
import { watchEffect, shallowRef, h, defineComponent } from 'vue'
import { usePage } from 'iles'

export default defineComponent({
  async setup () {
    const { page } = usePage()
    const resolvedLayout = shallowRef(undefined)

    watchEffect(() => {
      resolvedLayout.value = undefined
      const layoutPromise = page.value.layout
      if (layoutPromise === false)
        resolvedLayout.value = false
      else
        layoutPromise.then(m => resolvedLayout.value = m.default || m)
    })
    return {
      page,
      resolvedLayout,
    }
  },
  render () {
    if (this.resolvedLayout === false) return h(this.page)
    if (this.resolvedLayout === undefined) return undefined
    return h(this.resolvedLayout, null, { default: () => h(this.page) })
  },
})
</script>
