<script lang="ts">
import { defineComponent, computed, shallowRef, watch } from 'vue'
import { Head } from '@vueuse/head'
import { useAppConfig } from '../composables/appConfig'
import { usePage } from '../composables/pageData'
import { useRouterLinks } from '../composables/routerLinks'
import { resolveLayout } from '../layout'
import { resolveProps } from '../props'

export default defineComponent({
  name: 'îles',
  components: {
    Head,
  },
  mounted () {
    ;(window as any).__ILE_DISPOSE__ ||= new Map()
  },
  setup () {
    const appConfig = useAppConfig()
    useRouterLinks()

    const { page, route, props } = usePage()

    const layoutName = computed(() => page.value.layoutName)
    const layout = computed(() => route.meta.layout?.value)
    if (import.meta.env.DEV) {
      // HMR for layout changes
      watch([page, layoutName], async ([page], [oldPage]) => {
        if (page === oldPage) await resolveLayout(route)
      })

      // HMR for static path changes
      const getStaticPaths = computed(() => page.value.getStaticPaths)
      watch([page, getStaticPaths], async ([page], [oldPage]) => {
        if (page === oldPage) await resolveProps(route)
      })
    }

    const DebugPanel = shallowRef<null | typeof import('./DebugPanel.vue').default>(null)
    if (import.meta.env.DEV && appConfig.debug)
      import('./DebugPanel.vue').then(m => DebugPanel.value = m.default)

    return {
      layout,
      page,
      props,
      DebugPanel,
    }
  },
})
</script>

<template>
  <Head>
    <meta property="generator" content="îles">
  </Head>
  <Suspense>
    <router-view>
      <component :is="page" v-if="layout === false" v-bind="props"/>
      <component :is="layout" v-else>
        <template #default="layoutProps">
          <component :is="page" v-bind="{ ...layoutProps, ...props }"/>
        </template>
      </component>
    </router-view>
  </Suspense>
  <component :is="DebugPanel" v-if="DebugPanel"/>
</template>
