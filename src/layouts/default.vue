<script setup lang="ts">
let title = $ref('')

async function onRouteChange (route) {
  console.log({ route })
  const component = await route.component
  console.log({ component })
}
</script>

<template>
  <main class="px-4 py-10 w-max-65ch mx-auto">
    <DarkSwitch client:idle/>
    <router-view v-slot="{ Component, route }">
      <transition :name="route.meta.transition || 'fade'" mode="out-in">
        <article>
          {{ onRouteChange(route) }}
          <h1 class="text-3xl font-extrabold mb-8">{{ title }}</h1>
          <component
            :is="Component"
            :key="route.meta.usePathKey ? route.path : undefined"
          />
        </article>
      </transition>
    </router-view>
  </main>
</template>
