import Debug from 'debug'

export const debug = {
  hmr: Debug('iles:pages:hmr'),
}

export function slash(path: string): string {
  return path.replace(/\\/g, '/')
}
