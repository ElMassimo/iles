import type { ServerOptions, UserConfig as ViteUserConfig } from 'vite'
import { createServer as createViteServer, mergeConfig } from 'vite'
import { resolveConfig } from './config'
import IslandsPlugins from './plugin'

export async function createServer(root: string = process.cwd(), serverOptions: ServerOptions = {}) {
  const config = await resolveConfig(root)
  const viteConfig = mergeConfig(config.vite, {
    plugins: await IslandsPlugins(config),
    server: serverOptions,
  } as ViteUserConfig)

  return {
    config,
    viteConfig,
    server: await createViteServer(viteConfig),
  }
}
