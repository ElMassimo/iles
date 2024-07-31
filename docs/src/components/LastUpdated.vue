<template>
  <p v-if="$meta.lastUpdated" class="text-sm">
    <span class="inline-block font-medium">Last Updated:</span>
    <span class="inline-block ml-1.5 font-normal">
      <TimeAgo :date="$meta.lastUpdated" client:visible />
    </span>
  </p>
</template>
