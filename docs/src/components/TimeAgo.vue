<script setup lang="ts">
import { watch, onBeforeUnmount } from 'vue'

const props = defineProps<{ date: Date }>()
let { date } = $(props)

let relativeTimeStr = $ref('')
let dateStr = $computed(() => date.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' }))
let timeStr = $computed(() => date.toISOString())

if (!import.meta.env.SSR) {
  const currentTime = (hoursAgo: number) => {
    if (hoursAgo < 1) return 'a few minutes ago'
    if (hoursAgo < 2) return 'an hour ago'
    if (hoursAgo < 8) return 'a few hours ago'
    if (hoursAgo < 24) return 'today'
    if (hoursAgo < 24 * 30) return `${Math.ceil(hoursAgo / 24)} days ago`
    if (hoursAgo < 24 * 30 * 2) return '1 month ago'
    if (hoursAgo < 24 * 30 * 12) return `${Math.ceil(hoursAgo / (24 * 30))} months ago`
    return dateStr
  }

  const updateRelativeTimeStr = () =>
    relativeTimeStr = currentTime((new Date() - date) / (60 * 60 * 1000))

  let activeInterval = setInterval(updateRelativeTimeStr, 60 * 1000)
  onBeforeUnmount(() => clearInterval(activeInterval))
  watch($$(date), updateRelativeTimeStr, { immediate: true })
}
</script>

<template>
  <time :title="dateStr" :date-time="timeStr">{{ relativeTimeStr || dateStr }}</time>
</template>
