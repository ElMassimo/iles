import { init as initESLexer, parse as parseESModules } from 'es-module-lexer'
import type { ComponentInfo } from 'unplugin-vue-components/types'
import type { Awaited } from '../shared'

export type ImportsMetadata = Record<string, ComponentInfo>

export function parseId(id: string) {
  const index = id.indexOf('?')
  if (index < 0) { return { path: id, query: {} } }

  // eslint-disable-next-line ts/ban-ts-comment
  // @ts-ignore
  const query = Object.fromEntries(new URLSearchParams(id.slice(index)))
  return { path: id.slice(0, index), query }
}

export async function parseExports(code: string) {
  try {
    await initESLexer
    return parseESModules(code)[1].map(spec => spec.n)
  }
  catch (error) {
    console.error(error)
    return []
  }
}

export async function parseImports(code: string) {
  try {
    await initESLexer

    const imports = parseESModules(code)[0]
    const importMap: ImportsMetadata = Object.create(null)
    imports.forEach(({ d: isDynamic, n: from, ss: statementStart, s: importPathStart }) => {
      if (isDynamic > -1 || !from) { return }
      const importFragment = code.substring(statementStart, importPathStart)
      parseImportVariables(importFragment).forEach(([name, as = name]) => {
        importMap[as] = { name, as, from }
      })
    })
    return importMap
  }
  catch (error) {
    console.error(error)
    return {}
  }
}

export type ParsedImports = Awaited<ReturnType<typeof parseImports>>

// eslint-disable-next-line regexp/no-super-linear-backtracking
const importStatementRegex = /import\s*(.*?)\s*from['"\s]+$/s
// eslint-disable-next-line regexp/no-super-linear-backtracking
const importVarRegex = /(?:\{\s*((?:[^,}]+(?:,[,\s]*)?)+)\}|([^,]+))(?:[,\s]?|\s*$)+/g
const trim = (s: string) => s.trim()

export function parseImportVariables(partialStatement: string) {
  const variablesStr = partialStatement.match(importStatementRegex)?.[1].trim()
  if (!variablesStr) { return [] } // Example: import '~/styles/main.css'

  const variables = Array.from(variablesStr.matchAll(importVarRegex))
    .flatMap(([, inBrackets, outer]) => {
      if (inBrackets) { return inBrackets.split(',').map(trim).filter(x => x) }
      outer = outer.trim()
      return outer.includes(' as ') ? outer : `default as ${outer}`
    })

  return variables.map(variable => variable.split(' as ').map(trim))
}
