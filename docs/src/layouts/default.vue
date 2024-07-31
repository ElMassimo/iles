<template layout="base">
  <MainContainer grid>
    <TheSidebar />
    <div class="grid py-6 lg:py-10">
      <div class="prose min-w-0">
        <slot />
      </div>
      <PageFooter />
    </div>
    <TheRightSidebar />
  </MainContainer>
</template>
