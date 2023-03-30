import 'virtual:windi.css'
import 'virtual:windi-devtools'
import '~/styles/all.css'

import { defineApp } from 'iles'

import Image from '~/components/Image.vue'

import checkDarkTheme from '~/logic/dark-color-scheme-check?raw'
import type { Script } from '@unhead/schema'

type TurboScript = Script & { once: true }

const prodScripts = import.meta.env.PROD ? [
  { src: 'https://unpkg.com/thesemetrics@latest', async: true, once: true, crossorigin: 'anonymous' } as TurboScript,
] : []

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
