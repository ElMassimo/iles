import { defineConfig } from 'vite'
import icons from 'unplugin-icons/vite'
import windicss from 'vite-plugin-windicss'
import inspect from 'vite-plugin-inspect'
import restart from 'vite-plugin-restart'

export default defineConfig({
  plugins: [
    windicss(),
    icons(),
    inspect(),
    restart({
      restart: '../../packages/iles/dist/{node,shared}/**/*.{ts,js}',
      delay: 5000,
    }),
  ],
})
