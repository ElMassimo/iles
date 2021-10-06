<!-- <script client:idle lang="ts">
import { listen } from 'quicklink'
if (import.meta.env.PROD) listen()
</script> -->

<script setup lang="ts">
import { useRoute } from 'iles'

const route = useRoute()
let isHome = $computed(() => route.name === 'index')
let isDocs = $computed(() => !isHome)
</script>

<template>
  <TheNavBar/>
  <div :class="{ content: isDocs }" class="container !max-w-screen-2xl lg:px-6 mx-auto pt-$navbar-height">
    <TheSidebar :class="{ 'lg:hidden': isHome }"/>
    <div class="grid px-6 md:px-8 py-8 lg:py-12 relative">
      <HomeHero v-if="isHome"/>
      <div class="prose min-w-0">
        <slot/>
      </div>
      <PageFooter v-if="isDocs"/>
    </div>
    <TheRightSidebar v-if="isDocs"/>
  </div>
  <TheFooter v-if="isHome"/>
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
