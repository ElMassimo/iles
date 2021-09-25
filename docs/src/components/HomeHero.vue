<script setup lang="ts">
import { usePage } from 'iles'
import site from '~/site'
import heroImage from '/images/banner.png'

const { frontmatter } = usePage()
</script>

<template>
  <header class="flex items-center justify-center h-$full-header md:px-6">
    <div>
      <div class="space-y-2 mb-12 md:mb-14">
        <figure>
          <img
            class="mx-auto max-w-full w-auto max-h-64 md:h-64 block select-none"
            :src="heroImage"
            :alt="frontmatter.heroAlt"
          >
        </figure>

        <div class="text-center">
          <h1 id="main-title" class="hidden text-3xl leading-10 font-semibold sm:(text-5xl leading-16)">
            {{ site.title }}
          </h1>
          <p class="m-0 mt-1 text-lg opacity-75 leading-6 px-4 sm:(text-xl)">
            {{ frontmatter.tagline || site.description }}
          </p>

          <div class="flex space-x-4 mt-8 justify-center">
            <AppButton size="lg" :href="frontmatter.actionLink">
              {{ frontmatter.actionText }}
            </AppButton>
            <AppButton size="lg" :href="frontmatter.altActionLink" outline>
              {{ frontmatter.altActionText }}
            </AppButton>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>
