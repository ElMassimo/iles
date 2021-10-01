<script setup lang="ts">
import { defineAsyncComponent } from 'vue'
import { useAppConfig, usePage } from 'iles'
import { Head } from '@vueuse/head'

import { useRouterLinks } from '../composables/routerLinks'
import PageWithLayout from './PageWithLayout.vue'

useRouterLinks()
const { page } = usePage()

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
  <Head>
    <meta property="generator" content="îles">
  </Head>
  <Suspense>
    <router-view>
      <PageWithLayout :key="(page as any).__file" :page="page"/>
    </router-view>
  </Suspense>
  <DebugPanel/>
</template>
