<template>
  <button class="nav-bar-button inline-flex text-xl p-2">
    <slot />
  </button>
</template>

<style lang="postcss" scoped>
.nav-bar-button {
  @apply rounded-lg
    text-current text-1.05rem cursor-pointer
    focus:outline-none focus:bg-warmgray-200
    bg-warmgray-100 hover:bg-warmgray-200
    dark:(bg-dark-400 hover:bg-dark-300 focus:bg-dark-300) overflow-hidden;
}
</style>
