<script setup lang="ts">
import { usePage } from 'iles'
import DarkSwitch from '../components/DarkSwitch.vue'
import Default from './default.vue'
import { href } from '~/pages/index.vue'

const { frontmatter } = usePage()
</script>

<template>
  <Default>
    <template #switch>
      <DarkSwitch client:idle></DarkSwitch>
    </template>
    <template #default>
      <a :href="href">Back to index</a>
      <transition :name="frontmatter.transition || 'fade'" mode="out-in">
        <article class="prose mt-2">
          <h1>{{ frontmatter.title }}</h1>
          <slot/>
        </article>
      </transition>
    </template>
  </Default>
</template>
