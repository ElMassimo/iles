<script setup lang="ts">
import { usePage } from 'iles'
import { isArray, getSideBarConfig, getFlatSideBarLinks } from '~/logic/utils'

let { route, site } = $(usePage())

let candidates = $computed(() => {
  const config = getSideBarConfig(site.sidebar, route.path)

  return isArray(config) ? getFlatSideBarLinks(config) : []
})

let index = $computed(() => candidates.findIndex(item => item.link === route.path))
let next = $computed(() => index > -1 && candidates[index + 1])
let prev = $computed(() => index > -1 && candidates[index - 1])
let hasLinks = $computed(() => next || prev)
</script>

<template>
  <div v-if="hasLinks">
    <div class="flex border-t pt-6 justify-between items-center">
      <div class="max-w-1/2 flex items-center">
        <a v-if="prev" class="nav-link" :href="prev.link">
          <carbon-arrow-left class="mr-3" />
          <span class="text-sm md:text-base">{{ prev.text }}</span>
        </a>
      </div>
      <div class="max-w-1/2 flex items-center">
        <a v-if="next" class="nav-link text-right justify-end" :href="next.link">
          <span class="text-sm md:text-base">{{ next.text }}</span>
          <carbon-arrow-right class="ml-3" />
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
