import type { ServerOptions } from 'vite'
import { createServer as createViteServer, mergeConfig } from 'vite'
import { resolveConfig } from './config'

export async function createServer(root: string = process.cwd(), serverOptions: ServerOptions = {}) {
  const config = await resolveConfig(root)
  return createViteServer(mergeConfig(config.vite, { server: serverOptions }))
}
