<script setup lang="ts">
import { useDark, useToggle } from '@vueuse/core'

const isDark = useDark()
const toggleDark = useToggle(isDark)
</script>

<template>
  <nav class="text-xl space-x-2 absolute right-8 top-8">
    <button class="icon-btn" title="Toggle Dark" @click="toggleDark()">
      <transition name="slide" mode="out-in">
        <bx:bx-moon v-if="isDark"/>
        <bx:bx-sun v-else/>
      </transition>
    </button>
  </nav>
</template>

<style lang="scss" scoped>
.icon-btn {
  @apply inline-flex rounded-lg p-2
    text-$c-text text-1.05rem cursor-pointer
    focus:outline-none
    bg-warm-gray-100 hover:bg-warm-gray-200
    dark:(bg-dark-400 hover:bg-dark-300) overflow-hidden;
}
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.15s ease;
}

.slide-enter-from {
  transform: translateY(-100%);
}

.slide-enter-to,
.slide-leave-from {
  transform: translateY(0);
}

.slide-leave-to {
  transform: translateY(100%);
}
</style>
