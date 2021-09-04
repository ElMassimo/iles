import { init as initESLexer, parse as parseESModules } from 'es-module-lexer'

export function pascalCase(str: string) {
  return capitalize(camelCase(str))
}

export function camelCase(str: string) {
  return str.replace(/[^\w_]+(\w)/g, (_, c) => (c ? c.toUpperCase() : ''))
}

// export function kebabCase(key: string) {
//   const result = key.replace(/([A-Z])/g, ' $1').trim()
//   return result.split(' ').join('-').toLowerCase()
// }

export function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export async function parseImports (code: string) {
  try {
    await initESLexer

    const [imports,] = parseESModules(code)
    const importMap = Object.create(null)
    imports.filter(i => i.d === -1).forEach(i => {
      const importStatement = code.substring(i.ss, i.se)
      parseImportedVariables(importStatement)
    })
    return importMap
  }
  catch (e) {
    console.error(e)
    return {}
  }
}

export function parseImportedVariables (importStr: string) {
  if (!importStr)
    return []

  const exportStr = importStr.replace('import', 'export').replace(/\s+as\s+\w+,?/g, ',')
  let importVariables: readonly string[] = []
  try {
    importVariables = parseESModules(exportStr)[1]
  }
  catch (error) {
  }
  return importVariables
}
