export function unwrapDefault<T = any> (mod: any): T {
  return mod?.default ? unwrapDefault(mod.default) : mod
}

export function importModule<T = any> (path: string): Promise<T> {
  return import(path).then(unwrapDefault)
}
