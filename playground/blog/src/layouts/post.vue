<script setup lang="ts">
import Default from './default.vue'
import { useRoute } from 'iles'
import DarkSwitch from '../components/DarkSwitch.vue'

const { meta } = useRoute()
</script>

<template>
  <Default>
    <template #switch>
      <DarkSwitch client:idle></DarkSwitch>
    </template>
    <template #default>
      <transition :name="meta.transition || 'fade'" mode="out-in">
        <article class="prose">
          <h1>{{ meta.frontmatter.title }}</h1>
          <slot/>
        </article>
      </transition>
    </template>
  </Default>
</template>
