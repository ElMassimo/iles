<script setup lang="ts">
import { useRoute } from 'iles'

const route = useRoute()
let isIndex = $computed(() => route.path.replace(/index.html$/, '') === '/')
</script>

<template>
  <TheNavBar/>
  <div class="container pt-$navbar-height">
    <slot/>
  </div>
  <Quicklink client:only/>
</template>
