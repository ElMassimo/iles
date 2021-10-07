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
  <aside class="fixed z-50 md:z-0 md:static">
    <div class="h-full pointer-events-none">
      <SidebarBackground/>
      <div
        class="
          fixed top-0 left-0
          w-auto h-full pointer-events-auto
          transform -translate-x-full md:transform-none transition-transform duration-200 ease-linear
          min-w-62
          md:(h-$full-viewport sticky top-$navbar-height)
        "
        :class="{ '-translate-x-0': openSideBar }"
      >
        <div
          class="w-auto h-full bg-html md:bg-transparent"
        >
          <SidebarHeader @close="openSideBar = false"/>
          <div class="sticky top-$navbar-height h-$full-viewport overflow-y-auto">
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
