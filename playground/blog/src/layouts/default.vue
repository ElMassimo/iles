<script setup lang="ts">
import 'virtual:windi.css'
import 'virtual:windi-devtools'
import '~/styles/main.scss'
import { useHead } from 'iles'
import checkDarkTheme from '~/logic/dark?raw'

useHead({
  script: [
    { children: checkDarkTheme },
  ],
})
</script>

<template>
  <main class="px-4 py-10 w-max-65ch mx-auto">
    <slot name="switch"><DarkSwitch client:idle/></slot>
    <slot/>
  </main>
</template>
