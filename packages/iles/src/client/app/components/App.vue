<script setup lang="ts">
import { getLayout } from '../layouts'
import { useRouterLinks } from '../composables/routerLinks'

useRouterLinks()
</script>

<script lang="ts">
export default {
  name: 'IslandsApp',
}
</script>

<template>
  <Suspense>
    <router-view v-slot="{ Component: Page, route }">
      <component :is="getLayout(route)">
        <component :is="Page"/>
      </component>
    </router-view>
  </Suspense>
  <DebugIslands/>
</template>
