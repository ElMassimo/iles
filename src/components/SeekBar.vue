<script setup lang="ts">
import { onBeforeUnmount } from 'vue'
import { useResizeObserver } from '@vueuse/core'
import { formatSecondsAsMinutes } from '~/helpers/FormatHelper'

interface Props {
  // Public: Duration of the content that is being played.
  duration: number
  // Public: Current time of the content that is being played.
  currentTime: number
}

const props = defineProps<Props>()
let totalDuration = $computed(() => formatSecondsAsMinutes(props.duration))

let draggingTime = $ref<number | undefined>()
let isDragging = $computed(() => draggingTime !== undefined)
let seekingTime = $computed(() => isDragging ? draggingTime : props.currentTime)
let fractionElapsed = $computed(() =>
  props.duration === 0 || !isFinite(props.duration) ? 0 : seekingTime / props.duration,
)

const emit = defineEmits(['seekBar:timeChanged'])

// Internal: The original mouse X position when dragging the seek bar progress.
let initialMouseX = $ref<number | undefined>(undefined)

// Internal: The original seek bar progress when the dragging started (0 -> start, 1-> end)
let initialFraction = $ref(0)
// Internal: Width of the seek bar progress
let seekBarWidth = $ref(NaN)

let seekBar = $ref<HTMLElement | undefined>(undefined)
let seekBarIndicator = $ref<HTMLElement | undefined>(undefined)
useResizeObserver($$(seekBar), (entries) => {
  seekBarWidth = entries[0].contentRect.width
})
onBeforeUnmount(onTouchEnd)

// Internal: Stop dragging if the touch direction causes the page to scroll.
function onScroll () {
  draggingTime = undefined
  onTouchEnd()
}

function onTouchStart ({ touches }: TouchEvent) {
  const { screenX, clientX } = touches[0]!
  const seekBarLeft = seekBar ? seekBar.getBoundingClientRect().left : NaN
  onMouseDown({ screenX, offsetX: Math.round(clientX - seekBarLeft) })
  window.addEventListener('scroll', onScroll, { passive: true, capture: false })
}

function onMouseDown ({ screenX, offsetX }: MouseEvent | { screenX: number; offsetX: number }) {
  if (isDragging) return
  initialMouseX = screenX
  setCurrentFraction(initialFraction = offsetX / seekBarWidth)
  document.addEventListener('mouseup', onTouchEnd, { passive: true })
  document.addEventListener('mousemove', onMouseMove, { passive: true })
}

function onMouseMove ({ screenX }: MouseEvent) {
  if (!isDragging || initialMouseX === undefined) return
  const diffX = screenX - initialMouseX
  setCurrentFraction(diffX / seekBarWidth + initialFraction)
}

function onTouchMove ({ touches }: TouchEvent) {
  onMouseMove({ screenX: touches[0].screenX } as MouseEvent)
}

function onTouchEnd () {
  if (isFinite(draggingTime)) emit('seekBar:timeChanged', draggingTime)
  draggingTime = undefined
  document.removeEventListener('mouseup', onTouchEnd)
  document.removeEventListener('mousemove', onMouseMove)
  window.removeEventListener('scroll', onScroll)
}

function clamp (num: number, max: number) {
  return Math.min(Math.max(0, num), max)
}

function setCurrentFraction (fraction: number) {
  const time = clamp(fraction * props.duration, props.duration)
  if (isFinite(time)) draggingTime = time
}
</script>

<template>
  <div class="flex flex-auto items-center select-none">
    <span class="duration mr-4">{{ formatSecondsAsMinutes(seekingTime) }}</span>
    <div class="seek-bar-wrapper w-full group cursor-pointer">
      <div class="seek-bar-line bg-subtle dark:bg-shallow w-full rounded-lg">
        <div
          class="seek-bar-progress bg-primary dark:bg-primary-deep w-full h-full transform rounded-lg"
        />
      </div>
      <div
        class="seek-bar-indicator bg-primary rounded-full h-3 w-3 -ml-1.5 dark:bg-deeper transform hidden group-hover:block"
        :class="{ '!block': isDragging }"
      />
      <div
        ref="seekBar"
        class="seek-bar-touch w-full h-full z-1"
        @mousedown="onMouseDown"
        @touchstart.passive="onTouchStart"
        @touchmove.passive="onTouchMove"
        @touchend.passive="onTouchEnd"
      />
    </div>
    <span class="duration ml-4">{{ totalDuration }}</span>
  </div>
</template>

<style lang="scss" scoped>
.seek-bar-wrapper {
  @apply items-center z-1;

  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 1fr;
  height: 40px; // We want to create some area around the seek bar for the user to click on.
}

.seek-bar-line {
  @apply h-6px overflow-hidden;

  grid-area: 1 / 1;
}

.seek-bar-touch {
  @apply active:cursor-grabbing;

  grid-area: 1 / 1;
}

.seek-bar-progress {
  --tw-translate-x: calc(v-bind('fractionElapsed') * 100% - 100%);
}

.seek-bar-indicator {
  --tw-translate-x: calc(v-bind('fractionElapsed') * v-bind('seekBarWidth') * 1px);

  grid-area: 1 / 1;
}

.duration {
  @apply text-sm font-mono text-deep whitespace-pre;
}
</style>
