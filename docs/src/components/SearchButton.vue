<script client:load>
export const onLoad = el =>
  el.previousElementSibling?.addEventListener('click', () => {
    document.querySelector<HTMLElement>('.DocSearch-Button')?.click()
  })
</script>

<template>
  <DocSearch client:idle/>
  <NavBarButton aria-label="Search">
    <BxBxSearch/>
  </NavBarButton>
</template>
