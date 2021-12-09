import Debug from 'debug'

export const debug = {
  hmr: Debug('iles:pages:hmr'),
  parser: Debug('iles:pages:parser'),
  gen: Debug('iles:pages:gen'),
  options: Debug('iles:pages:options'),
}

export function slash (path: string): string {
  return path.replace(/\\/g, '/')
}
