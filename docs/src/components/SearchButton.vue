<script client:load lang="ts">
import type { OnLoadFn } from 'iles'

export const onLoad: OnLoadFn = el =>
  el.previousElementSibling?.addEventListener('click', () => {
    document.querySelector<HTMLElement>('.DocSearch-Button')?.click()
  })
</script>

<template>
  <DocSearch client:idle/>
  <NavBarButton aria-label="Search">
    <IconBxBxSearch/>
  </NavBarButton>
</template>
