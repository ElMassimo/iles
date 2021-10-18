<script client:load>
export const onLoad = el =>
  el.previousElementSibling.addEventListener('click', () => {
    document.querySelector('.DocSearch-Button')?.click()
  })
</script>

<template>
  <DocSearch client:load/>
  <NavBarButton aria-label="Search">
    <BxBxSearch/>
  </NavBarButton>
</template>
