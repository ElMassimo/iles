import { defineConfig } from 'vite-plugin-windicss'
import typography from 'windicss/plugin/typography'

export default defineConfig({
  darkMode: 'class',
  plugins: [
    typography(),
  ],
  blocklist: ['content-type', '.content', '<animate', 'duration', '.duration'],
  theme: {
    extend: {
      colors: {
        primary: 'var(--color-primary)',
        'primary-deep': 'var(--color-primary-deep)',
        shallow: 'var(--fg-shallow)',
        normal: 'var(--fg)',
        deep: 'var(--fg-deep)',
        deeper: 'var(--fg-deeper)',
        subtle: 'var(--color-subtle)',
      },
      cursor: {
        'grab': 'grab',
        'grabbing': 'grabbing',
      },
      screens: {
        print: { raw: 'print' },
      },
      typography: {
        DEFAULT: {
          css: {
            color: 'var(--fg)',
            fontSize: '1.125rem',
            maxWidth: '65ch',
            a: {
              color: 'var(--color-primary)',
            },
            b: { color: 'var(--fg-deep)' },
            strong: { color: 'var(--fg-deep)' },
            blockquote: { color: 'var(--fg-deep)' },
            em: { color: 'inherit' },
            h1: { color: 'var(--fg-deeper)' },
            h2: { color: 'var(--fg-deep)' },
            h3: { color: 'inherit' },
            h4: { color: 'inherit' },
          },
        },
      },
    },
  },
})
