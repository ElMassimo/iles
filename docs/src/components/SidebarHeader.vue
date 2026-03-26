<template>
  <div
    class="h-$navbar-height bg-light-700 dark:bg-dark-400 flex md:hidden items-center justify-between px-2"
  >
    <NavBarLink
      class="text-xl hover:text-primary-soft ml-1 cursor-pointer"
      aria-label="Close Sidebar"
    >
      <IconCarbonArrowLeft />
    </NavBarLink>
    <div class="flex items-center">
      <NavBarLinks />
    </div>
  </div>
</template>
