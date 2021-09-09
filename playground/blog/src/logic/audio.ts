import type { Ref } from 'vue'
import { watch, onUnmounted } from 'vue'

interface Player {
  isPlaying: Ref<boolean>
  pauseAudio: Function
}

let currentPlayer: Player | undefined

export function pauseWhenOtherPlays (player: Player) {
  watch(player.isPlaying, (playing) => {
    if (playing && currentPlayer !== player) {
      currentPlayer?.pauseAudio()
      currentPlayer = player
    }
  })
  onUnmounted(() => {
    if (currentPlayer === player) currentPlayer = undefined
  })
}
