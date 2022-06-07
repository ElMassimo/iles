import 'virtual:windi.css'
import 'virtual:windi-devtools'
import '~/styles/all.css'

import { defineApp } from 'iles'

import Image from '~/components/Image.vue'

import checkDarkTheme from '~/logic/dark-color-scheme-check?raw'

const prodScripts = import.meta.env.PROD ? [
  { src: 'https://unpkg.com/thesemetrics@latest', async: true, once: true, crossorigin: 'anonymous' },
] : []

export default defineApp({
  head: {
    htmlAttrs: { lang: 'en-US' },
    script: [
      { children: checkDarkTheme, once: true },
      ...prodScripts,
    ],
  },
  mdxComponents: {
    img: Image,
  },
})
