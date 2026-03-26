<script setup lang="ts">
import { isDark, toggleDark } from "~/logic/dark";
</script>

<template>
  <NavBarButton aria-label="Toggle theme" @click="toggleDark()">
    <transition name="slide" mode="out-in">
      <IconBxBxMoon v-if="isDark" />
      <IconBxBxSun v-else />
    </transition>
  </NavBarButton>
</template>

<style lang="postcss">
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
