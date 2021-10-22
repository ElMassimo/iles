<script client:media="(max-width: 767px)" lang="ts">
import { watch } from 'vue'

export function onLoad () {
  let openSideBar = $ref(false)

  watch($$(openSideBar), (v) => {
    document.documentElement.classList.toggle('<md:overflow-hidden', v)
    document.getElementById('sidebar-background')?.classList.toggle('hidden', !v)
    document.getElementById('sidebar-panel')?.classList.toggle('!-translate-x-0', v)
  })

  document.querySelectorAll<HTMLElement>('[data-sidebar]').forEach((el) => {
    el.addEventListener('click', () => { openSideBar = el.dataset.sidebar === 'open' })
  })
}
</script>

<template>
  <aside class="fixed z-50 md:z-0 md:static">
    <div class="h-full pointer-events-none">
      <SidebarBackground id="sidebar-background" data-sidebar="close"/>
      <div
        id="sidebar-panel"
        data-sidebar="close"
        class="
          fixed top-0 left-0
          w-auto h-full pointer-events-auto
          transform -translate-x-full md:transform-none transition-transform duration-200 ease-linear
          lg:min-w-62
          md:(h-$full-viewport sticky top-$navbar-height)
        "
      >
        <div
          class="w-auto h-full bg-html md:bg-transparent"
        >
          <SidebarHeader/>
          <div class="sticky top-$navbar-height h-$full-viewport overflow-y-auto">
            <SidebarNav/>
          </div>
        </div>
      </div>
    </div>
  </aside>
</template>
