<script lang="ts">
export default {
  name: 'IslandsApp',
}
</script>

<template>
  <Suspense>
    <router-view v-slot="{ Component: Page, route }">
      <component :is="route.meta.layout">
        <component :is="Page"/>
      </component>
    </router-view>
    <DebugIslands/>
  </Suspense>
</template>
