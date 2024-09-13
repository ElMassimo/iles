import type { ServerOptions, UserConfig as ViteUserConfig } from 'vite'
import { preview as vitePreview, mergeConfig } from 'vite'
import { resolveConfig } from './config'

export async function preview (root: string = process.cwd(), serverOptions: ServerOptions = {}) {
  const config = await resolveConfig(root)
  const viteConfig = mergeConfig(config.vite, {
    preview: serverOptions,
  } as ViteUserConfig)

  const server = await vitePreview(viteConfig)
  server.printUrls()
}
