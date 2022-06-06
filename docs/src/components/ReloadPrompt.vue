<script client:load lang="ts">
import type { OnLoadFn } from 'iles'
import { registerSW } from 'virtual:pwa-register'

export const onLoad: OnLoadFn = () => {
  const pwaDialog = document.querySelector<HTMLDivElement>('#pwa-dialog')!
  const pwaToastMessage = pwaDialog.querySelector<HTMLDivElement>('#pwa-message')!
  const pwaCloseBtn = pwaDialog.querySelector<HTMLButtonElement>('#pwa-cancel')!
  const pwaRefreshBtn = pwaDialog.querySelector<HTMLButtonElement>('#pwa-refresh')!

  let refreshSW: ((reloadPage?: boolean) => Promise<void>) | undefined

  const refreshCallback = () => refreshSW?.(true)

  const hidePwaDialog = (raf = false) => {
    if (raf) {
      requestAnimationFrame(() => hidePwaDialog(false))
      return
    }

    pwaDialog.removeAttribute('aria-role')
    pwaDialog.setAttribute('aria-hidden', 'true')
    if (pwaDialog.classList.contains('refresh'))
      pwaRefreshBtn.removeEventListener('click', refreshCallback)

    pwaDialog.classList.remove('show', 'refresh')
  }

  const showPwaDialog = (offline: boolean) => {
    if (!offline)
      pwaRefreshBtn.addEventListener('click', refreshCallback)

    requestAnimationFrame(() => {
      hidePwaDialog(false)
      pwaDialog.removeAttribute('aria-hidden')
      pwaDialog.setAttribute('aria-role', offline ? 'dialog' : 'alertdialog')
      if (!offline)
        pwaDialog.classList.add('refresh')

      pwaDialog.classList.add('show')
    })
  }

  window.addEventListener('load', () => {
    pwaCloseBtn.addEventListener('click', () => hidePwaDialog(true))
    refreshSW = registerSW({
      immediate: true,
      // onOfflineReady () {
      //   pwaToastMessage.innerHTML = 'Application ready to work offline.'
      //   showPwaDialog(true)
      // },
      onNeedRefresh () {
        pwaToastMessage.innerHTML = 'New content available, click on reload button to update.'
        showPwaDialog(false)
      },
    })
  })
}
</script>

<template>
  <div
    id="pwa-dialog"
    aria-hidden="true"
    aria-labelledby="pwa-message"
  >
    <div id="pwa-message"/>
    <button id="pwa-refresh" type="button">Reload</button>
    <button id="pwa-cancel" type="button">Close</button>
  </div>
</template>
<style scoped>
#pwa-dialog {
  visibility: hidden;
  position: fixed;
  right: 0;
  bottom: 0;
  margin: 16px;
  padding: 12px;
  border: 1px solid #8885;
  border-radius: 4px;
  z-index: 1;
  text-align: left;
  background-color: var(--bg-html);
  box-shadow: 3px 4px 5px 0 #8885;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-column-gap: 1rem;
}
#pwa-dialog #pwa-message {
  margin-bottom: 8px;
  grid-column: 1 / span 2;
}
#pwa-dialog button {
  border: 1px solid #8885;
  outline: none;
  margin-right: 5px;
  border-radius: 4px;
  padding: 3px 10px;
  grid-column: auto;
}
#pwa-dialog.show {
  visibility: visible;
}
#pwa-dialog button#pwa-refresh {
  display: none;
}
#pwa-dialog.show.refresh button#pwa-refresh {
  display: block;
}
</style>
