<script lang="ts">
import { defineComponent, computed } from 'vue'
import { useRoute, useRouter } from 'iles'

export default defineComponent({
  name: 'NotFound',
  layoutFn: false,
  setup () {
    const route = useRoute()
    const router = useRouter()
    const routes = computed(() => {
      const info = router.getRoutes().map(({ path, name }) => ({ path, name }))
      return JSON.stringify(info, null, 2)
    })
    return { route, routes }
  },
})
</script>

<template>
  <div class="not-found">
    <h1>Page Not Found</h1>

    <dl>
      <dt>Path</dt>
      <dd>{{ route.path }}</dd>
    </dl>
    <dl>
      <dt>Routes</dt>
      <dd>{{ routes }}</dd>
    </dl>
  </div>
</template>

<style scoped>
.not-found {
  max-width: 400px;
  margin: 10vh auto;
}

h1 {
  font-size: 40px;
  font-weight: bold;
  margin: 2rem 0;
}

p,
dt {
  font-weight: bold;
  margin-bottom: 0.2rem;
}

dl,
dd {
  font-size: .9rem;
}

dd {
  font-family: monospace;
  white-space: pre-wrap;
  margin-bottom: 1em;
}
</style>
