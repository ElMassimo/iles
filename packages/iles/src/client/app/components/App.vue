<script setup lang="ts">
import { computed, shallowRef, watch } from 'vue'
import { useAppConfig, usePage } from 'iles'
import { Head } from '@vueuse/head'
import { useRouterLinks } from '../composables/routerLinks'
import { resolveLayout } from '../layout'

const appConfig = useAppConfig()
useRouterLinks()

const { page, route } = usePage()

const layoutName = computed(() => page.value.layoutName)
const layout = computed(() => route.meta.layout?.value)
if (import.meta.env.DEV) // HMR for layout changes
  watch([page, layoutName], async ([page], [oldPage]) => {
    if (page === oldPage) await resolveLayout(route)
  })

const DebugPanel = shallowRef<null | typeof import('./DebugPanel.vue').default>(null)
if (import.meta.env.DEV && appConfig.debug)
  import('./DebugPanel.vue').then(m => DebugPanel.value = m.default)
</script>

<script lang="ts">
export default {
  name: 'îles',
}
</script>

<template>
  <Head>
    <meta property="generator" content="îles">
  </Head>
  <Suspense>
    <router-view>
      <component v-if="layout === false" :is="page"/>
      <component v-else :is="layout" :key="(page as any).__file">
        <component :is="page"/>
      </component>
    </router-view>
  </Suspense>
  <component v-if="DebugPanel" :is="DebugPanel"/>
</template>
