<script setup lang="ts">
import { ref, computed, watch, onBeforeUnmount } from 'vue'

const { date } = defineProps<{ date: Date }>()

const relativeTimeStr = ref('')
const dateStr = computed(() => date.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' }))
const timeStr = computed(() => date.toISOString())

if (!import.meta.env.SSR) {
  const currentTime = (hoursAgo: number): string => {
    if (hoursAgo < 1) return 'a few minutes ago'
    if (hoursAgo < 2) return 'an hour ago'
    if (hoursAgo < 8) return 'a few hours ago'
    if (hoursAgo < 24) return 'today'
    if (hoursAgo < 24 * 8) return 'this week'
    if (hoursAgo < 24 * 30) return 'this month'
    return date.toLocaleDateString('en-US', { day: 'numeric', month: 'long' })
  }

  const updateRelativeTimeStr = () => {
    relativeTimeStr.value = currentTime((Number(new Date()) - Number(date)) / (60 * 60 * 1000))
  }

  const activeInterval = setInterval(updateRelativeTimeStr, 60 * 1000)
  onBeforeUnmount(() => clearInterval(activeInterval))
  watch(() => date, updateRelativeTimeStr, { immediate: true })
}
</script>

<template>
  <time :title="dateStr" :date-time="timeStr">{{ relativeTimeStr || dateStr }}</time>
</template>
