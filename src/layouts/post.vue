<script setup lang="ts">
import AudioPlayer from '~/components/AudioPlayer.vue'
</script>

<template>
  <main class="px-4 py-10 w-max-65ch mx-auto">
    <DarkSwitch client:idle/>
    <router-view v-slot="{ Component, route }">
      <transition :name="route.meta.transition || 'fade'" mode="out-in">
        <article class="prose">
          <h1>{{ Component.type.title }}</h1>
          <component
            :is="Component"
            :components="{ AudioPlayer }"
            :key="route.meta.usePathKey ? route.path : undefined"
          />
        </article>
      </transition>
    </router-view>
  </main>
</template>
