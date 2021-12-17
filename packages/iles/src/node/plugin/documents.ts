import type { Plugin } from 'vite'
import type { AppConfig } from '../shared'

import glob from 'fast-glob'
import { resolve } from 'pathe'
import { promises as fs } from 'fs'
import { parseId } from './parse'
import { serialize } from './utils'

const usageRegex = /\buseDocuments\s*\(([^)]+)\)/sg

const allowedRegex = /(\.vue|\.[tj]sx?)$/

const DOCS_VIRTUAL_ID = '@islands/documents'

export default function documentsPlugin (config: AppConfig): Plugin {
  const { root, namedPlugins: { pages } } = config

  return {
    name: 'iles:documents',
    async transform (code, id) {
      if (!allowedRegex.test(id)) return

      const paths: [string, string][] = []
      code = code.replaceAll(usageRegex, (_, path) => {
        path = path.trim().slice(1, -1)
        const id = `_documents_${paths.length}`
        paths.push([id, path])
        return id
      })

      const imports = paths.map(([id, path]) =>
        `import ${id} from '${DOCS_VIRTUAL_ID}?path=${path}'`)

      return `${code};${imports.join(';')}`
    },
    resolveId (id) {
      if (id.startsWith(DOCS_VIRTUAL_ID))
        return id
    },
    async load (id) {
      if (!id.startsWith(DOCS_VIRTUAL_ID)) return

      const { query: { path: rawPath } } = parseId(id)

      const path = await config.resolvePath(rawPath) || rawPath as string
      const pattern = path.includes('*') ? path : `${path}/**/*.{md,mdx}`

      const files = await glob(pattern, { cwd: root })
      const data = await Promise.all(files.map(file => pages.api.frontmatterForFile(file)))

      const documents = data.map(({ route: _, meta, layout, ...frontmatter }, index) => {
        return { ...meta, ...frontmatter, meta, frontmatter, render: `${index}_render` }
      })

      const serialized = serialize(documents).replace(/render:"(\w+)"/g, (_, id) => {
        const index = id.split('_')[0]
        const { filename } = data[index].meta
        return `component: defineAsyncComponent(() => import('/${filename}'))`
      })

      return `
        import { defineAsyncComponent } from 'vue'

        export default ${serialized}
      `
    },
  }
}
