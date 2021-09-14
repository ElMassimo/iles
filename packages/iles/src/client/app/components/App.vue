<script setup lang="ts">
import { defineAsyncComponent } from 'vue'
import { useAppConfig, useRoute } from 'iles'
import { getLayout } from '@islands/layouts'
import { useRouterLinks } from '../composables/routerLinks'

useRouterLinks()

const route = useRoute()
let layout = $computed(() => getLayout(route))

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
      <component v-if="layout" :is="layout">
        <component :is="Page"/>
      </component>
      <component v-else :is="Page"/>
    </router-view>
  </Suspense>
  <DebugPanel/>
</template>
