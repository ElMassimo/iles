<script lang="ts">
import { defineComponent, computed, watch } from 'vue'
import { Head } from '@vueuse/head'
import { usePage } from '../composables/pageData'
import { useRouterLinks } from '../composables/routerLinks'
import { resolveLayout } from '../layout'

export default defineComponent({
  name: 'îles',
  components: {
    Head,
  },
  setup () {
    if (import.meta.env.DEV && !import.meta.env.SSR)
      useRouterLinks()

    const { page, route, props } = usePage()

    const layoutName = computed(() => page.value.layoutName)
    const layout = computed(() => route.meta.layout?.value)
    if (import.meta.env.DEV) {
      // HMR for layout changes
      watch([page, layoutName], async ([page], [oldPage]) => {
        if (page === oldPage) await resolveLayout(route)
      })
    }

    return {
      layout,
      page,
      props,
    }
  },
  mounted () {
    (window as any).__ILE_DISPOSE__ ||= new Map()
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
</template>
