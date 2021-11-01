export function importModule (path) {
  return import(path).then(mod => mod && mod.default ? mod.default : mod)
}
