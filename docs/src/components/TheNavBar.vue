<script setup lang="ts">
import Site from '~/site'
</script>

<template>
  <header class="nav-bar bg-html flex items-center border-b">
    <div class="flex flex-1 h-full container !max-w-screen-2xl mx-auto px-2 md:px-6">
      <div class="flex items-center lg:hidden">
        <SidebarToggle/>
      </div>
      <div class="flex flex-1 items-center lg:flex-none">
        <NavBarLogo/>
      </div>
      <div class="hidden lg:flex items-center flex-1 justify-end">
        <NavBarLinks/>
      </div>
      <div class="flex items-center lg:pl-3 xl:pl-6">
        <DocSearchBox client:load/>
        <DarkModeSwitch client:load/>
      </div>
    </div>
  </header>
</template>

<style scoped lang="postcss">
.nav-bar {
  @apply fixed top-0 inset-x-0 z-50 border-$bg-soft;
  height: var(--navbar-height);
}
</style>
