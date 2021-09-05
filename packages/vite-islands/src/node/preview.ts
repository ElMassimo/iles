import { preview } from 'vite'
import { resolveConfig } from './config'

export interface ServeOptions {
  root?: string
  port?: number
}

export async function serve (options: ServeOptions = {}) {
  if (options.port === undefined) options.port = 5000
  const config = await resolveConfig(options)
  await preview(config, options)
}
