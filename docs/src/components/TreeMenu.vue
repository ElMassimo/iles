<template>
  <nav class="flex lg:hidden flex-col py-3">
    <template>
      <div v-for="item in $site.nav" :key="item.text">
        <NavLink :item="item" class="pl-8"/>
      </div>
    </template>
  </nav>
</template>
