<script setup lang="ts">
import Site from '~/site'

defineEmits(['close'])
</script>

<template>
  <div class="h-$header-height bg-light-700 dark:bg-dark-400 flex lg:hidden items-center justify-between px-2">
    <NavBarLink class="text-xl hover:text-primary-soft ml-6" @click="$emit('close')">
      <carbon:arrow-left/>
    </NavBarLink>
    <div class="flex items-center">
      <NavBarLink class="text-xl hover:text-primary-soft ml-6" :href="Site.github" external>
        <carbon-logo-github/>
      </NavBarLink>
      <DarkModeSwitch/>
    </div>
  </div>
</template>
