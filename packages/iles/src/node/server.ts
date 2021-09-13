import type { ServerOptions, UserConfig as ViteUserConfig } from 'vite'
import type { AppConfig } from './shared'
import { createServer as createViteServer, mergeConfig } from 'vite'
import { resolveConfig } from './config'
import IslandsPlugins from './plugin'

export async function createServer(root: string = process.cwd(), serverOptions: ServerOptions = {}) {
  const config = await resolveConfig(root)
  const viteConfig = mergeConfig(config.vite, {
    plugins: IslandsPlugins(config),
    server: serverOptions,
  } as ViteUserConfig)

  return {
    config,
    viteConfig,
    server: await createViteServer(viteConfig),
  }
}

export async function createAutoRestartingServer (root: string, serverOptions: ServerOptions = {}) {
  const { config, server } = await createServer(root, serverOptions)
  server.watcher.add(config.configPath)

  const restartIfConfigChanged = async (path: string) => {
    if (path !== config.configPath) return
    await server.close()
    await createAutoRestartingServer(root, serverOptions)
  }

  // Shut down the server and start a new one if config changes.
  server.watcher.on('add', restartIfConfigChanged)
  server.watcher.on('change', restartIfConfigChanged)

  return await server.listen()
}
