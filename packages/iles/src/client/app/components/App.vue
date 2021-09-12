<script setup lang="ts">
import { useRoute } from 'iles'
import { getLayout } from '../layouts'
import { useRouterLinks } from '../composables/routerLinks'

useRouterLinks()

const route = useRoute()
let layout = $computed(() => getLayout(route))
</script>

<script lang="ts">
export default {
  name: 'IslandsApp',
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
  <DebugIslands/>
</template>
