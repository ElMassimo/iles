<script client:media="(max-width: 767px)" lang="ts">
import { ref, watch } from 'vue'

const doc = document

export function onLoad () {
  const openSideBar = ref(false)

  watch(openSideBar, (open) => {
    doc.documentElement.classList.toggle('<md:overflow-hidden', open)

    const [panel, bg] = [doc.getElementById('sidebar-panel')!, doc.getElementById('sidebar-background')!]

    panel.classList.toggle('!-translate-x-0', open)

    if (open) {
      bg.classList.remove('hidden')
      bg.classList.remove('opacity-0')
    }
    else {
      bg.classList.add('opacity-0')
      panel.addEventListener('transitionend', e => bg.classList.add('hidden'), { once: true })
    }
  })

  document.querySelectorAll<HTMLElement>('[data-sidebar]').forEach((el) => {
    el.addEventListener('click', () => { openSideBar.value = el.dataset.sidebar === 'open' })
  })
}
</script>

<template>
  <aside class="fixed z-50 md:z-0 border-r md:static">
    <div class="h-full pointer-events-none">
      <SidebarBackground id="sidebar-background" data-sidebar="close"/>
      <div
        id="sidebar-panel"
        data-sidebar="close"
        class="
          fixed top-0 left-0
          w-auto h-full pointer-events-auto
          transform -translate-x-full md:transform-none
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

<style scoped>
#sidebar-background {
  background: rgba(0,0,0,.6);
  transition: opacity .5s;

  &.hidden {
    display: block;
    width: 0;
  }
}

#sidebar-panel {
  transition: transform .5s cubic-bezier(.19,1,.22,1);
}
</style>
