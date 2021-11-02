function unwrapModule (mod) {
  return mod && mod.default ? unwrapModule(mod.default) : mod
}

exports.importESModule = function importESModule (path) {
  return import(path).then(unwrapModule)
}
