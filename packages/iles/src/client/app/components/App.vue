<script setup lang="ts">
import { computed, defineAsyncComponent } from 'vue'
import { useAppConfig, usePage } from 'iles'
import { useRouterLinks } from '../composables/routerLinks'
import Layout from './Layout.vue'
import { Head } from '@vueuse/head'

useRouterLinks()

const { route, frontmatter, page: Page } = usePage()

// TODO: Set 'page.layout = import' in Vue and MDX components and use directly.
// Internal: Skip layout by default for non-HTML pages.
const layoutName = computed(() => {
  const extIndex = route.value.path.lastIndexOf('.')
  if (extIndex > -1 && route.value.path.slice(extIndex) !== '.html') return false
  return frontmatter.value.layout ?? 'default'
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
  <Head>
    <meta property="generator" content="îles"/>
  </Head>
  <Suspense>
    <router-view>
      <Layout :key="(Page as any).__file" :name="layoutName">
        <component :is="Page"/>
      </Layout>
    </router-view>
  </Suspense>
  <DebugPanel/>
</template>
