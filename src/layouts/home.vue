<template>
  <main class="px-4 py-10 w-max-65ch mx-auto">
    <DarkSwitch client:idle/>
    <router-view v-bind="$attrs"/>
  </main>
</template>
