export const okMark = '\x1B[32m✓\x1B[0m'
export const failMark = '\x1B[31m✖\x1B[0m'

export function slash (path: string): string {
  return path.replace(/\\/g, '/')
}
