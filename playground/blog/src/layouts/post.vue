<script setup lang="ts">
import { useData } from 'iles'
import DarkSwitch from '../components/DarkSwitch.vue'
import Default from './default.vue'

const { frontmatter } = useData()
</script>

<template>
  <Default>
    <template #switch>
      <DarkSwitch client:idle></DarkSwitch>
    </template>
    <template #default>
      <transition :name="frontmatter.transition || 'fade'" mode="out-in">
        <article class="prose">
          <h1>{{ frontmatter.title }}</h1>
          <slot/>
        </article>
      </transition>
    </template>
  </Default>
</template>
