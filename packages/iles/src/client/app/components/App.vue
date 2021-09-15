<script setup lang="ts">
import { computed, defineAsyncComponent } from 'vue'
import { useAppConfig, useRoute } from 'iles'
import { useRouterLinks } from '../composables/routerLinks'
import Layout from './Layout.vue'

useRouterLinks()

const route = useRoute()

// Internal: Skip layout by default for non-HTML pages.
const layoutName = computed(() => {
  const extIndex = route.path.lastIndexOf('.')
  if (extIndex > -1 && route.path.slice(extIndex) !== '.html') return false
  return route.meta.layout
})

const appConfig = useAppConfig()
const DebugPanel = import.meta.env.DEV && appConfig.debug
  ? defineAsyncComponent(() => import('./DebugPanel.vue'))
  : () => null
</script>

<script lang="ts">
export default {
  name: 'îles',
}
</script>

<template>
  <Suspense>
    <router-view v-slot="{ Component: Page }">
      <Layout :name="layoutName">
        <component :is="Page"/>
      </Layout>
    </router-view>
  </Suspense>
  <DebugPanel/>
</template>
