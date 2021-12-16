<script setup lang="ts">
import { useSideBarLinks } from '~/logic/sidebar'

let { route } = usePage()

let candidates = $(useSideBarLinks())

let index = $computed(() => candidates.findIndex(item => item.link === route.path))
let next = $computed(() => index > -1 && candidates[index + 1])
let prev = $computed(() => index > -1 && candidates[index - 1])
let hasLinks = $computed(() => next || prev)
</script>

<template>
  <div v-if="hasLinks" class="-mx-2 md:-mx-4">
    <div class="flex border-t pt-6 justify-between items-center">
      <div class="max-w-1/2 flex items-center">
        <a v-if="prev" class="nav-link" :href="prev.link">
          <IconCarbonArrowLeft class="mr-3"/>
          <span class="text-sm md:text-base">{{ prev.text }}</span>
        </a>
      </div>
      <div class="max-w-1/2 flex items-center">
        <a v-if="next" class="nav-link text-right justify-end" :href="next.link">
          <span class="text-sm md:text-base">{{ next.text }}</span>
          <IconCarbonArrowRight class="ml-3"/>
        </a>
      </div>
    </div>
  </div>
</template>

<style scoped lang="postcss">
.nav-link {
  @apply
    inline-flex items-center px-1 md:px-3
    font-semibold
    text-cool-gray-500 dark:text-gray-400
    hover:(text-gray-800 dark:text-white);
}
</style>
