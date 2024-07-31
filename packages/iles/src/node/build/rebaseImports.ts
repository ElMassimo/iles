import { posix } from 'node:path'
import { init as initESLexer, parse as parseESModules } from 'es-module-lexer'
import MagicString from 'magic-string'
import type { AppConfig } from '../shared'

export default async function rebaseImports({ base, assetsDir }: AppConfig, codeStr: string) {
  const assetsBase = posix.join(base, assetsDir)
  try {
    await initESLexer
    const imports = parseESModules(codeStr)[0]
    const code = new MagicString(codeStr)
    imports.forEach(({ s, e, d }) => {
      // Skip quotes if dynamic import.
      if (d > -1) {
        s += 1
        e -= 1
      }
      code.overwrite(s, e, posix.join(assetsBase, code.slice(s, e)), { contentOnly: true })
    })
    return code.toString()
  }
  catch (error) {
    console.error(error)
    return codeStr
  }
}
