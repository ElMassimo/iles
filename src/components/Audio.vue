<script lang="ts" setup>
import { onMounted } from 'vue'
import { useIntersectionObserver } from '@vueuse/core'
import { pauseWhenOtherPlays } from '~/logic/audio'

const props = defineProps<{ src: string, initialDuration: number }>()
const emit = defineEmits(['audio:error'])

let currentTime = $ref(0)
let duration = $ref<number>(props.initialDuration)

// Internal: Indicates the internal status of the player.
type Status = 'playing' | 'paused' | 'stopped'
let status = $ref<Status>('stopped')
let isPlaying = $computed(() => status === 'playing')

let audioRef = $ref<HTMLAudioElement | undefined>(undefined)
const audioListeners = {
  play () {
    status = 'playing'
  },
  playing () {
    status = 'playing'
  },
  pause () {
    status = 'paused'
  },
  stalled () {
    status = 'stopped'
  },
  ended () {
    status = 'stopped'
  },
  error (event: ErrorEvent) {
    status = 'stopped'
    errorMessage = 'Error al reproducir la práctica.'
  },
  durationchange () {
    if (audioRef) duration = audioRef.duration || NaN
  },
  timeupdate () {
    if (audioRef) currentTime = audioRef.currentTime
  },
}

function pauseAudio () {
  audioRef?.pause()
}

pauseWhenOtherPlays({ isPlaying: $$(isPlaying), pauseAudio })

function playOrPauseAudio () {
  isPlaying ? pauseAudio() : audioRef?.play()
}

function onTimeChanged (time: number) {
  if (audioRef) audioRef.currentTime = time
  currentTime = time
}

// Avoid loading audio unless the element is visible.
let el = $ref<HTMLElement | undefined>()
let isVisible = $ref(false)
const observer = useIntersectionObserver($$(el), ([{ isIntersecting }]) => {
  if (!isIntersecting) return
  isVisible = isIntersecting
  observer.stop()
})

let errorMessage = $ref('')
</script>

<template>
  <div v-if="errorMessage" class="text-pink-500 md:text-center mt-2 mb-4" @click="errorMessage = ''">
    {{ errorMessage }}
  </div>
  <div v-else ref="el" class="flex items-center whitespace-nowrap">
    <SeekBar
      :duration="duration"
      :currentTime="currentTime"
      @seekBar:timeChanged="onTimeChanged"
    />
    <span class="ml-4">
      <PlayButton class="w-12 h-12" :isPlaying="isPlaying" @click="playOrPauseAudio"/>
    </span>
    <audio
      v-if="isVisible"
      ref="audioRef"
      class="hidden"
      :src="src"
      preload="metadata"
      v-on="audioListeners"
    />
  </div>
</template>
