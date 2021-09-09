import path from 'path'
import { init as initESLexer, parse as parseESModules } from 'es-module-lexer'
import MagicString from 'magic-string'

interface ImportMetadata {
  name: string
  path: string
}

export async function parseImports (code: string) {
  try {
    await initESLexer

    const imports = parseESModules(code)[0]
    const importMap: Record<string, ImportMetadata> = Object.create(null)
    imports.forEach(({ d: isDynamic, n: path, ss: statementStart, s: importPathStart }) => {
      if (isDynamic > -1 || !path) return
      const importFragment = code.substring(statementStart, importPathStart)
      parseImportVariables(importFragment).forEach(([name, asName]) => {
        importMap[asName] = { name, path }
      })
    })
    return importMap
  }
  catch (error) {
    console.error(error)
    return {}
  }
}

export async function rebaseImports (assetsBase: string, codeStr: string) {
  if (!assetsBase) return codeStr
  try {
    await initESLexer
    const imports = parseESModules(codeStr)[0]
    const code = new MagicString(codeStr)
    imports.forEach(({ s, e }) => {
      code.overwrite(s, e, path.join(assetsBase, code.slice(s, e)))
    })
    return code.toString()
  }
  catch (error) {
    console.error(error)
    return codeStr
  }
}

const importStatementRegex = /import\s*(.*?)\s*from['"\s]+$/s
const importVarRegex = /(?:\{\s*((?:[^,}]+[,\s]*)+)\}|([^,]+))(?:[,\s]*|\s*$)+/sg
const trim = (s: string) => s.trim()

export function parseImportVariables (partialStatement: string) {
  const variablesStr = partialStatement.match(importStatementRegex)?.[1].trim()
  if (!variablesStr) return [] // Example: import '~/styles/main.css'

  const variables = Array.from(variablesStr.matchAll(importVarRegex))
    .flatMap(([, inBrackets, outer]) => {
      if (inBrackets) return inBrackets.split(',').map(trim).filter(x => x)
      outer = outer.trim()
      return outer.includes(' as ') ? outer : `default as ${outer}`
    })

  return variables.map(variable => variable.split(' as ').map(trim))
}
