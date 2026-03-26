import {
  defineConfig,
  presetIcons,
  presetTypography,
  presetUno,
  transformerDirectives,
} from 'unocss'
import transformerVariantGroup from '@unocss/transformer-variant-group'

export default defineConfig({
  transformers: [transformerDirectives(), transformerVariantGroup()],
  presets: [
    presetUno(),
    presetTypography({
      cssExtend: {
        '.prose pre': {
          'background-color': '#1f2937 !important',
          'color': '#e5e7eb !important',
        },
      },
    }),
    presetIcons({
      prefix: 'i-', // default prefix
    }),
  ],
  safelist: ['blockquote', 'figure', 'code', 'p', 'a'],
})
