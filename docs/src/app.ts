import 'virtual:uno.css'
import '@unocss/reset/tailwind-compat.css'
import '~/styles/all.css'

import { defineApp } from 'iles'

import Image from '~/components/Image.vue'

import checkDarkTheme from '~/logic/dark-color-scheme-check?raw'
import type { Script } from '@unhead/schema'

type TurboScript = Script & { once: true }

export default defineApp({
  head: {
    htmlAttrs: { lang: 'en-US' },
    script: [
      { children: checkDarkTheme, once: true } as TurboScript,
    ],
  },
  mdxComponents: {
    img: Image,
  },
})
