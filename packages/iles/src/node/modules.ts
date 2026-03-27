export function unwrapDefault<T = any> (mod: any): T {
  return mod?.default ? unwrapDefault(mod.default) : mod
}

function slash (path: string): string {
  return path.replace(/\\/g, '/')
}

export function importModule<T = any> (path: string): Promise<T> {
  // handle modules in Windows file system
  if (process.platform === 'win32') {
    // handle D:\path\to\file
    if (path.match(/^\w:\\/))
      return import(`file:///${slash(path)}`).then(unwrapDefault)

    // handle D:/path/to/file
    if (path.match(/^\w:\//))
      return import(`file:///${path}`).then(unwrapDefault)
  }

  return import(path).then(unwrapDefault)
}
