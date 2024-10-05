import 'virtual:uno.css'
import '@unocss/reset/tailwind-compat.css'
import '~/styles/all.css'

import { defineApp } from 'iles'

import type { Script } from '@unhead/schema'
import Image from '~/components/Image.vue'

import checkDarkTheme from '~/logic/dark-color-scheme-check?raw'

type TurboScript = Script & { once: true }

const prodScripts = import.meta.env.PROD
  ? [
      { src: 'https://unpkg.com/thesemetrics@latest', async: true, once: true, crossorigin: 'anonymous' } as TurboScript,
    ]
  : []

export default defineApp({
  head: {
    htmlAttrs: { lang: 'en-US' },
    script: [
      { children: checkDarkTheme, once: true } as TurboScript,
      ...prodScripts,
    ],
  },
  mdxComponents: {
    img: Image,
  },
})
