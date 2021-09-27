<script setup lang="ts">
import { watch } from 'vue'
import { useRoute } from 'iles'
import { openSideBar } from '~/logic/sidebar'

const route = useRoute()

watch(() => route.path, () => openSideBar.value = false)

watch(openSideBar, (v) =>
  document.documentElement.classList.toggle('overflow-hidden', v)
)

</script>

<template>
  <aside class="fixed z-50 lg:z-0 lg:static">
    <div class="h-full pointer-events-none">
      <SidebarBackground/>
      <div
        class="
          fixed top-0 left-0
          w-auto h-full pointer-events-auto
          transform -translate-x-full lg:transform-none transition-transform duration-200 ease-linear
          min-w-62
          lg:(h-$full-header sticky top-$header-height)
        "
        :class="{ '-translate-x-0': openSideBar }"
      >
        <div
          class="w-auto h-full bg-$windi-bg lg:bg-transparent"
        >
          <SidebarHeader @close="openSideBar = false"/>
          <div class="sticky top-$header-height h-$full-header overflow-y-auto">
            <TreeMenu/>
            <SidebarNav/>
          </div>
        </div>
      </div>
    </div>
  </aside>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
