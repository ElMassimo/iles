function unwrapModule (mod) {
  console.log('unwrapModule', mod)
  return mod && mod.default ? unwrapModule(mod.default) : mod
}

exports.importModule = function importModule (path) {
  return import(path).then(unwrapModule)
}
