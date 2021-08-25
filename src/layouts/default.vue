<template>
  <main class="px-4 py-10 w-max-65ch mx-auto">
    <DarkSwitch client:idle/>
    <router-view v-slot="{ Component, route }">
      <transition :name="route.meta.transition || 'fade'" mode="out-in">
        <article>
          <h1 class="text-3xl font-extrabold mb-8">{{ Component.title }}</h1>
          <component
            :is="Component"
            :key="route.meta.usePathKey ? route.path : undefined"
          />
        </article>
      </transition>
    </router-view>
  </main>
</template>
