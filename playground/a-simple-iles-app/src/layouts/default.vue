<script setup lang="ts">
  import {computed} from 'vue'
  const {route} = usePage()

  const navs = [
    {title: 'Home', to: '/'},
    {title: 'About Us', to: '/about-us'},
  ]
  const currentPath = computed(() => {
    return route.path
  })
  // Other site-wide logic
</script>

<template>
  <div>
    <header>
      <nav>
        <!-- NavBar vue island with client hydration strategy -->
        <a
          v-for="({title, to}, index) in navs"
          :key="index"
          :href="to"
          :class="{active: currentPath === to}">
          {{ title }}
        </a>
      </nav>
      <!-- SearchBar solid island with client hydration strategy -->
    </header>
    <main>
      <!-- Pages are typically static with few dynamic islands -->
      <!-- Pages using this default layout will load in this slot -->
      <slot />
    </main>
    <footer>
      <!-- TheFooter static vue component with no interactions -->
    </footer>
  </div>
</template>

<style>
  body {
    font-family: Arial, sans-serif;
    margin: 0;
    height: 200vh;
  }
  nav {
    display: flex;
    justify-content: center;
    gap: 1rem;
    padding: 1rem;
  }
  a {
    text-decoration: none;
    font-weight: bold;
  }
  a.active {
    text-decoration: underline;
  }
</style>
