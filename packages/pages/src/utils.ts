import Debug from 'debug'

export const debug = {
  hmr: Debug('iles:pages:hmr'),
  gen: Debug('iles:pages:gen'),
}

export function slash (path: string): string {
  return path.replace(/\\/g, '/')
}
