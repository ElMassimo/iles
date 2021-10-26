<script setup lang="ts">
defineProps<{ date: string | Date }>()

function toDate (date: string | Date) {
  return date instanceof Date ? date : new Date(date)
}

function getDateTime (date: string | Date) {
  return toDate(date).toISOString()
}

function formatDate (dateStr: string | Date) {
  const date = toDate(dateStr)
  date.setUTCHours(12)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}
</script>

<template>
  <dl>
    <dt class="sr-only">Published on</dt>
    <dd class="text-base leading-6 font-medium text-gray-500">
      <time :datetime="getDateTime(date)">{{ formatDate(date) }}</time>
    </dd>
  </dl>
</template>
