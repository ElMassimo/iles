<script setup lang="ts">
import { useRoute } from 'iles'

const route = useRoute()
let isIndex = $computed(() => route.path.replace(/index.html$/, '') === '/')
</script>

<template>
  <TheNavBar/>
  <div :class="{ content: !isIndex }" class="container !max-w-screen-2xl lg:px-6 mx-auto pt-$navbar-height">
    <TheSidebar :class="{ 'lg:hidden': isIndex }"/>
    <div class="grid px-6 md:px-8 py-8 lg:py-12 relative">
      <HomeHero v-if="isIndex"/>
      <div class="prose min-w-0">
        <slot/>
      </div>
      <PageFooter v-if="!isIndex"/>
    </div>
    <TheRightSidebar v-if="!isIndex"/>
  </div>
  <TheFooter v-if="isIndex"/>
  <Quicklink client:only/>
</template>

<style scoped lang="postcss">
.content {
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 1fr;
  gap: 0px 12px;
}

@screen lg {
  .content {
    grid-template-columns: 250px 1fr 250px;
  }
}
</style>
