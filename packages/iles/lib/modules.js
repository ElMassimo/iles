function unwrapDefault (mod) {
  return mod && mod.default ? unwrapDefault(mod.default) : mod
}

exports.unwrapDefault = unwrapDefault

exports.importModule = function importModule (path) {
  return import(path).then(unwrapDefault)
}
