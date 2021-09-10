<script setup lang="ts">
const props = defineProps({ date: [String, Date] })

function getDateTime() {
  return new Date(props.date).toISOString()
}

function formatDate(date) {
  if (!(date instanceof Date)) {
    date = new Date(date)
  }
  date.setUTCHours(12)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}
</script>

<template>
  <dl>
    <dt class="sr-only">Published on</dt>
    <dd class="text-base leading-6 font-medium text-gray-500">
      <time :datetime="getDateTime()">{{ formatDate(date) }}</time>
    </dd>
  </dl>
</template>
