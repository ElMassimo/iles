<script setup lang="ts">
import Site from '~/site'
</script>

<template>
  <div v-for="item in Site.nav" :key="item.text" class="item">
    <NavBarLink class="" :href="item.link" :text="item.text"/>
  </div>
  <NavBarLink class="text-xl hover:text-primary-soft ml-6" :href="Site.github" external>
    <carbon-logo-github/>
  </NavBarLink>
</template>
