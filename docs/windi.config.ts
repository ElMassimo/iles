import { defineConfig } from 'vite-plugin-windicss'
import lineClamp from 'windicss/plugin/line-clamp'

export default defineConfig({
  darkMode: 'class',
  blocklist: ['content-type', 'content', 'container', 'table', '<transition'],
  preflight: {
    safelist: ['blockquote', 'figure', 'code'],
    blocklist: ['table', 'img'],
  },
  plugins: [
    lineClamp,
  ],
  theme: {
    extend: {
      borderColor: theme => ({
        DEFAULT: 'var(--bg-soft)',
      }),
      colors: {
        html: 'var(--bg-html)',
        'primary-soft': 'var(--fc-primary-soft)',
        primary: 'var(--fc-primary)',
        'primary-intense': 'var(--fc-primary-intense)',
        soft: 'var(--fc-soft)',
        normal: 'var(--fc)',
        hard: 'var(--fc-hard)',
        intense: 'var(--fc-intense)',
      },
      fontFamily: {
        sans: ['"Inter"', 'ui-sans-serif','system-ui','-apple-system','BlinkMacSystemFont','"Segoe UI"','Roboto','"Helvetica Neue"','Arial','"Noto Sans"','sans-serif','"Apple Color Emoji"','"Segoe UI Emoji"','"Segoe UI Symbol"','"Noto Color Emoji"'],
        mono: ['ui-monospace','SFMono-Regular','Menlo','Monaco','Consolas','"Liberation Mono"','"Courier New"','monospace'],
      },
      screens: {
        xs: '500px',
        '2xl': '1400px',
      },
      transitionTimingFunction: {
        sharp: 'cubic-bezier(0.165, 0.63, 0.14, 0.82)',
      },
    },
  },
})
