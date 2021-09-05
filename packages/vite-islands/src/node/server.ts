import { createServer as createViteServer, ServerOptions } from 'vite'
import { resolveConfig } from './config'
import ViteIslandsPlugin from './plugin'

export async function createServer ({ root, ...options }: ServerOptions = {}) {
  const config = await resolveConfig({ root }, 'serve')

  return createViteServer({
    root: config.srcDir,
    base: config.site.base,
    plugins: [
      ViteIslandsPlugin(),
    ],
    server: options,
  })
}
