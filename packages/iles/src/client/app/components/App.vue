<script setup lang="ts">
import { computed, watchEffect, shallowRef, h, defineComponent, defineAsyncComponent } from 'vue'
import { useAppConfig, usePage } from 'iles'
import type { RouteComponent } from 'vue-router'
import { Head } from '@vueuse/head'
import { useRouterLinks } from '../composables/routerLinks'

const appConfig = useAppConfig()
useRouterLinks()

const DebugPanel = import.meta.env.DEV && appConfig.debug
  ? defineAsyncComponent(() => import('./DebugPanel.vue'))
  : () => null

const PageWithLayout = defineComponent({
  name: 'PageWithLayout',
  async setup () {
    const { page } = usePage()
    const layoutFn = computed(() => page.value.layoutFn)

    const resolvedLayout = shallowRef<undefined | false | RouteComponent>(undefined)
    watchEffect(async () => {
      const fn = layoutFn.value
      resolvedLayout.value = typeof fn === 'function' ? await fn() : fn
    })
    return { page, resolvedLayout }
  },
  render () {
    const layout = this.resolvedLayout

    if (layout === undefined) return undefined
    if (!layout) return h(this.page)

    const key = (this.page as any).__file
    return h(layout, { key }, { default: () => h(this.page) })
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
      <PageWithLayout/>
    </router-view>
  </Suspense>
  <DebugPanel/>
</template>
