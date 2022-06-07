<script client:load lang="ts">
import { OnLoadFn } from 'iles'
import { registerSW } from 'virtual:pwa-register'

let refreshSW: ((reloadPage?: boolean) => Promise<void>) | undefined

const showDialog = (display: boolean) =>
  document.getElementById('pwa-dialog')?.setAttribute('aria-hidden', String(!display))

addEventListener('load', () => {
  refreshSW = registerSW({ immediate: true, onNeedRefresh: () => showDialog(true) })
})

export const onLoad: OnLoadFn = () => {
  document.getElementById('pwa-cancel')!.addEventListener('click', () => showDialog(false))
  document.getElementById('pwa-refresh')!.addEventListener('click', () => refreshSW?.(true))
}
</script>

<template>
  <div
    id="pwa-dialog"
    aria-role="alertdialog"
    aria-hidden="true"
    aria-labelledby="pwa-message"
    class="border rounded-md flex items-center p-4 m-4"
  >
    <div id="pwa-message" class="mr-6">New content is available</div>
    <AppButton id="pwa-cancel" outline>Close</AppButton>
    <AppButton id="pwa-refresh">Reload</AppButton>
  </div>
</template>

<style scoped>
#pwa-dialog[aria-hidden="true"] {
  display: none;
}

#pwa-dialog {
  background-color: var(--bg-html);
  box-shadow: inset 0 -1px 0 var(--br-normal);
  bottom: 0;
  position: fixed;
  right: 0;
}
</style>
