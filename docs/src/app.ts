import 'virtual:windi.css'
import 'virtual:windi-devtools'
import '~/styles/all.css'

import { defineApp } from 'iles'

import checkDarkTheme from '~/logic/dark-color-scheme-check?raw'

const prodScripts = import.meta.env.PROD ? [
  { src: 'https://unpkg.com/thesemetrics@latest', async: true },
] : []

export default defineApp({
  head: {
    htmlAttrs: { lang: 'en-US' },
    script: [
      { children: checkDarkTheme },
      ...prodScripts,
    ],
  },
})
