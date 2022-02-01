import { defineConfig } from 'vite-plugin-windicss'
import typography from 'windicss/plugin/typography'

export default defineConfig({
  preflight: {
    safelist: ['blockquote', 'figure', 'code', 'p', 'a'],
  },
  plugins: [
    typography(),
  ],
})
