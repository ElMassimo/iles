<template layout="base">
  <MainContainer>
    <TheSidebar class="md:hidden" />
    <div class="px-6 md:px-8 viewport">
      <HomeHero />
      <HomeFeatures />
    </div>
  </MainContainer>
  <TheFooter />
</template>

<style scoped>
.viewport {
  min-height: calc(var(--full-viewport) - var(--footer-height));
}
</style>
