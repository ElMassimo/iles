<script setup lang="ts">
import { ref, computed, watch } from 'vue'

const props = withDefaults(defineProps<{ isPlaying: boolean }>(), { isPlaying: false })

const label = computed(() => props.isPlaying ? 'Pausar' : 'Reproducir')

const animateRef = ref<SVGAnimateElement | null>(null)

const begin = ref('indefinite')
const play = 'M11,10 L18,13.74 18,22.28 11,26 M18,13.74 L26,18 26,18 18,22.28'
const pause = 'M11,10 L17,10 17,26 11,26 M20,10 L26,10 26,26 20,26'

watch(() => props.isPlaying, (isPlaying) => {
  begin.value = '0s'
  animateRef.value?.beginElement()
})
</script>

<template>
  <button class="play-button bg-primary text-white rounded-full grid place-items-center transform transition-transform transition-bg" aria-live="assertive" :aria-label="label">
    <svg
      :class="{ 'pl-2px': !isPlaying }"
      class="fill-current h-2/3 transition-all"
      viewBox="0 0 36 36"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink"
    >
      <path :d="play">
        <animate
          ref="animateRef"
          :begin="begin"
          attributeType="XML"
          attributeName="d"
          fill="freeze"
          :from="isPlaying ? play : pause"
          :to="isPlaying ? pause : play"
          dur="0.2s"
          keySplines=".4 0 1 1"
          repeatCount="1"
        />
      </path>
    </svg>
  </button>
</template>

<style lang="scss" scoped>
.play-button {
  @apply opacity-85 duration-400;

  outline: none!important;

  &:hover,
  &:focus {
    @apply opacity-100 scale-110;
  }
}
</style>
