<script setup lang="ts">
/* eslint-disable @typescript-eslint/no-var-requires */
import { useFile } from 'iles'
import { formatDate } from '~/helpers/FormatHelper'

// Public: Url of the audio file
const props = defineProps<{ audio: string; title: string; recorded: Date }>()

let initialDuration = NaN
if (import.meta.env.SSR) {
  const getMP3Duration = require('get-mp3-duration')
  const buffer = useFile(`public${props.audio}`)
  initialDuration = getMP3Duration(buffer) / 1000
}
</script>

<template>
  <div class="audio-player">
    <Audio client:visible :src="audio" :initialDuration="initialDuration"/>
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
