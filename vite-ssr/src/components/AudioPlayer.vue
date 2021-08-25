<script setup lang="ts">
// Public: Url of the audio file
defineProps<{ url: string; title: string, recorded: string }>()

let errorMessage = $ref('')
function onError (event: Event) {
  errorMessage = 'Error al reproducir la práctica.'
}
</script>

<template>
  <div class="audio-player">
    <Audio v-if="!errorMessage" :src="url" @audio:error="onError"/>
    <div class="flex flex-col md:items-center mt-2">
      <div v-if="errorMessage" class="text-pink-500 mt-2 mb-4" @click="errorMessage = ''">
        {{ errorMessage }}
      </div>
      <a class="flex items-center opacity-75 hover:opacity-100 select-none !no-underline" :href="url" :download="`${title}.mp3`">
        <bx:bx-download class="inline mr-2"/> Descarga esta práctica
      </a>
      <p class="opacity-75 text-sm">
        Grabada en {{ recorded }}.
      </p>
    </div>
  </div>
</template>

<style lang="scss">
</style>
