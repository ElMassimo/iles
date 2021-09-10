import { defineConfig } from 'vite'
import islands from 'iles'
import windicss from 'vite-plugin-windicss'
import inspect from 'vite-plugin-inspect'

export default defineConfig({
  plugins: [
    islands(),
    windicss(),
    inspect(),
  ],
})
