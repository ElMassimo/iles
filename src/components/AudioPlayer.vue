<script lang="ts">
{ inheritAttrs: false }
</script>

<script setup lang="ts">
import { formatDate } from '~/helpers/FormatHelper'

// Public: Url of the audio file
defineProps<{ audio: string; title: string, recorded: Date }>()
</script>

<template>
  <div class="audio-player">
    <Audio client:idle :src="audio"/>
    <div class="flex flex-col md:items-center mt-2">
      <a class="flex items-center opacity-75 hover:opacity-100 select-none !no-underline" :href="audio" :download="`${title}.mp3`">
        <bx:bx-download class="inline mr-2"/> Descarga esta práctica
      </a>
      <p class="opacity-75 text-sm">
        Grabada en {{ formatDate(recorded) }}.
      </p>
    </div>
  </div>
</template>

<style lang="scss">
</style>
