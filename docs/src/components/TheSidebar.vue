<script client:idle lang="ts">
import { ref, watch } from 'vue'

export function onLoad () {
  let openSideBar = ref(false)

  const within = (el: null | HTMLElement, fn: (el: HTMLElement) => boolean): boolean =>
    el ? fn(el) || within(el.parentElement, fn) : false

  watch(openSideBar, (v) => {
    document.documentElement.classList.toggle('overflow-hidden', v)
    document.getElementById('sidebar-background')?.classList.toggle('hidden', !v)
    document.getElementById('sidebar-panel')?.classList.toggle('!-translate-x-0', v)
  })

  window.addEventListener('click', ({ target }) => {
    if (within(target as HTMLElement, el => el.dataset?.toggle === 'sidebar' || el.id === 'sidebar'))
      openSideBar.value = !openSideBar.value
  })
}
</script>

<template>
  <aside id="sidebar" class="fixed z-50 md:z-0 md:static">
    <div class="h-full pointer-events-none">
      <SidebarBackground/>
      <div
        id="sidebar-panel"
        class="
          fixed top-0 left-0
          w-auto h-full pointer-events-auto
          transform -translate-x-full md:transform-none transition-transform duration-200 ease-linear
          min-w-62
          md:(h-$full-viewport sticky top-$navbar-height)
        "
      >
        <div
          class="w-auto h-full bg-html md:bg-transparent"
        >
          <SidebarHeader data-toggle="sidebar"/>
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
