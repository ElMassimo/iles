import { defineComponent } from 'vue'
import { useRoute } from 'vue-router'

export default defineComponent({
  name: 'PageContent',
  setup() {
    const route = useRoute()
    console.log(route.matched, route.matched.map(m => m.components.default))
    return () => null
  }
})
