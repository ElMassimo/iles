import { resolve } from 'path'
import { defineConfig } from 'vite'
import islands from 'vite-islands'
import icons from 'unplugin-icons/vite'
import windicss from 'vite-plugin-windicss'
import inspect from 'vite-plugin-inspect'

export default defineConfig({
  resolve: {
    alias: {
      '~': resolve(__dirname, 'src')
    },
  },
  plugins: [
    islands(),
    windicss(),
    icons(),
    inspect(),
  ],
})
