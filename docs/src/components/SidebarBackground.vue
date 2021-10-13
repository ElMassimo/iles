<template>
  <transition name="fade">
    <div
      id="sidebar-background"
      data-toggle="sidebar"
      class="
        hidden
        fixed top-0 left-0 z-0
        w-full h-full
        bg-cool-gray-200
        pointer-events-auto
        backdrop-filter backdrop-blur-sm
        dark:bg-dark-800 dark:bg-opacity-80
        bg-opacity-50
        md:hidden
      "
    />
  </transition>
</template>
