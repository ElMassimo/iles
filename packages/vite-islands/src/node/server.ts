import { createServer as createViteServer, ServerOptions } from 'vite'
import { resolveConfig } from './config'
import { addViteIslandsPlugin } from './plugin'

export async function createServer (options: ServerOptions = {}) {
  const config = await resolveConfig(options.root)

  return createViteServer({
    root: config.srcDir,
    base: config.site.base,
    plugins: addViteIslandsPlugin(root, config),
    server: options,
  })
}
