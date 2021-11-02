function unwrapModule (mod) {
  return mod && mod.default ? unwrapModule(mod.default) : mod
}

export function importModule (path) {
  return import(path).then(unwrapModule)
}
