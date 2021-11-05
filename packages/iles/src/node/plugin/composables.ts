import { promises as fs } from 'fs'
import { resolve } from 'pathe'
import { uniq } from './utils'
import { parseImports } from './parse'

const definitionRegex = /(?:function|const|let|var)\s+(definePageComponent|use(?:Page|Route|Head)\b)/g
const composableUsageRegex = /\b(definePageComponent|use(?:Page|Route|Head))\s*\(/g

export async function autoImportComposables (code: string, id: string): Promise<string | void> {
  const matches = Array.from(code.matchAll(composableUsageRegex))
  if (matches.length === 0) return

  const imports = await parseImports(code)
  const defined = new Set(Array.from(code.matchAll(definitionRegex)).map(a => a[1]))

  const composables = uniq(matches.map(a => a[1]))
    .filter(composable => !defined.has(composable) && !imports[composable])
    .join(', ')

  if (composables)
    return `${code}\nimport { ${composables} } from "iles"`
}

export function writeComposablesDTS (root: string) {
  fs.writeFile(resolve(root, 'composables.d.ts'), `// generated by iles
// We suggest you to commit this file into source control

declare global {
  const definePageComponent: typeof import('iles')['definePageComponent']
  const useHead: typeof import('iles')['useHead']
  const usePage: typeof import('iles')['usePage']
  const useRoute: typeof import('iles')['useRoute']
}

export { }
`, 'utf-8')
}