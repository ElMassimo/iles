export function unwrapDefault (mod) {
  return mod && mod.default ? unwrapDefault(mod.default) : mod
}

export function importModule (path) {
  return import(path).then(unwrapDefault)
}
