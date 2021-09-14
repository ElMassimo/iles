import { join } from 'path'
import { init as initESLexer, parse as parseESModules } from 'es-module-lexer'
import MagicString from 'magic-string'
import type { AppConfig } from '../shared'

export default async function rebaseImports ({ base, assetsDir }: AppConfig, codeStr: string) {
  const assetsBase = join(base, assetsDir)
  try {
    await initESLexer
    const imports = parseESModules(codeStr)[0]
    const code = new MagicString(codeStr)
    imports.forEach(({ s, e }) => {
      code.overwrite(s, e, join(assetsBase, code.slice(s, e)))
    })
    return code.toString()
  }
  catch (error) {
    console.error(error)
    return codeStr
  }
}
