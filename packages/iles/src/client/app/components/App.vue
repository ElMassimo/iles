<script setup lang="ts">
import { computed, watchEffect, shallowRef, h, defineComponent, defineAsyncComponent } from 'vue'
import { useAppConfig, usePage } from 'iles'
import { Head } from '@vueuse/head'
import { useRouterLinks } from '../composables/routerLinks'

const { page } = usePage()
const appConfig = useAppConfig()
useRouterLinks()

const DebugPanel = import.meta.env.DEV && appConfig.debug
  ? defineAsyncComponent(() => import('./DebugPanel.vue'))
  : () => null

const PageWithLayout = defineComponent({
  async setup () {
    const { page } = usePage()
    const layoutFn = computed(() => page.value.layoutFn)

    const resolvedLayout = shallowRef(undefined)
    watchEffect(async () => {
      const fn = layoutFn.value
      resolvedLayout.value = fn === false ? fn : await fn()
    })

    return { page, resolvedLayout }
  },
  render () {
    const layout = this.resolvedLayout
    if (layout === undefined) return undefined
    if (layout === false) return h(this.page)
    return h(layout, null, { default: () => h(this.page) })
  },
})
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
      <PageWithLayout :key="(page as any).__file"/>
    </router-view>
  </Suspense>
  <DebugPanel/>
</template>
