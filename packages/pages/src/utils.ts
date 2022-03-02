import Debug from 'debug'

export const debug = {
  files: Debug('iles:pages:files'),
  hmr: Debug('iles:pages:hmr'),
  routes: Debug('iles:pages:routes'),
}

export function slash (path: string): string {
  return path.replace(/\\/g, '/')
}
