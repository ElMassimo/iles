import { preview } from 'vite'
import { resolveConfig } from './config'

export interface ServeOptions {
  root?: string
  port?: number
}

export async function serve ({ root, port = 5000 }: ServeOptions = {}) {
  const config = await resolveConfig({ root }, 'serve', 'production')
  await preview(config, { root })
}
