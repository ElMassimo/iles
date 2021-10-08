<script setup lang="ts">
defineEmits(['close'])
</script>

<template>
  <div class="h-$navbar-height bg-light-700 dark:bg-dark-400 flex md:hidden items-center justify-between px-2">
    <NavBarLink class="text-xl hover:text-primary-soft ml-1 cursor-pointer" @click="$emit('close')">
      <CarbonArrowLeft/>
    </NavBarLink>
    <div class="flex items-center">
      <NavBarLinks/>
    </div>
  </div>
</template>
