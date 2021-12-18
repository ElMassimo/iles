import { Plugin, ViteDevServer } from 'vite'
import type { AppConfig } from '../shared'

import glob from 'fast-glob'
import { isMatch } from 'micromatch'
import { relative } from 'pathe'
import { parseId } from './parse'
import { serialize } from './utils'

const usageRegex = /\buseDocuments\s*\(([^)]+)\)/sg

const fileCanUseDocuments = /(\.vue|\.[tj]sx?)$/

const DOCS_VIRTUAL_ID = '/@islands/documents'

interface DocumentModule {
  pattern: string
  isMatch: (path: string) => boolean
}

export default function documentsPlugin (config: AppConfig): Plugin {
  const { root, namedPlugins: { pages } } = config

  let server: ViteDevServer

  const modulesById: Record<string, DocumentModule> = Object.create(null)

  return {
    name: 'iles:documents',
    configureServer (devServer) {
      server = devServer
    },
    resolveId (id) {
      if (id.startsWith(DOCS_VIRTUAL_ID))
        return id
    },
    // Extract frontmatter for each file in the matching pattern, and create a
    // module where the default export is an array with each matching document.
    async load (id, options) {
      if (!id.startsWith(DOCS_VIRTUAL_ID)) return

      const { query: { pattern: rawPath } } = parseId(id)

      // Extract pattern from the virtual module path, and resolve any alias.
      const path = relative(root, await config.resolvePath(rawPath) || rawPath)
      const pattern = path.includes('*') ? path : `${path}/**/*.{md,mdx}`

      // Allow Vite to automatically detect added or removed files.
      if (server) {
        modulesById[id] = { pattern, isMatch: (path) => isMatch(path, pattern) }
      }

      // Obtain files matching the specified pattern and extract frontmatter.
      const files = await glob(pattern, { cwd: root })
      const data = await Promise.all(files.map(async file =>
        pages.api.pageForFilename(file)?.frontmatter || pages.api.frontmatterForFile(file)))

      // Create the structure of each document in the default export.
      const documents = data.map(({ route: _, meta, layout, ...frontmatter }, index) => {
        return { ...meta, ...frontmatter, meta, frontmatter, component: `${index}_component` }
      })

      // Serialize all the documents, adding a `component` factory function.
      const serialized = serialize(documents).replace(/component:"(\w+)"/g, (_, id) => {
        const index = id.split('_')[0]
        const { filename } = data[index].meta
        return `component: () => import('/${filename}').then(m => m.default)`
      })

      // Use defineAsyncComponent to support using <component :is="doc"> directly.
      return `
        import { defineAsyncComponent } from 'vue'

        export default ${serialized}
          .map(doc => ({ ...doc, ...defineAsyncComponent(doc.component) }))
      `
    },
    async transform (code, id) {
      // Ensure Vite keeps track of files imported by the documents pattern.
      if (server && id.startsWith(DOCS_VIRTUAL_ID)) {
        ;(server as any)._globImporters[id] = {
          module: server.moduleGraph.getModuleById(id),
          importGlobs: [{ base: root, pattern: modulesById[id].pattern }]
        }
        return
      }

      // Replace each usage of useDocuments with an import of a virtual module.
      if (fileCanUseDocuments.test(id)) {
        const paths: [string, string][] = []
        code = code.replaceAll(usageRegex, (_, path) => {
          path = path.trim().slice(1, -1)
          const id = `_documents_${paths.length}`
          paths.push([id, path])
          return id
        })
        if (paths.length) {
          const imports = paths.map(([id, path]) =>
            `import ${id} from '${DOCS_VIRTUAL_ID}?pattern=${path}'`)

          return `${code};${imports.join(';')}`
        }
      }
    },
    handleHotUpdate(ctx) {
      const file = relative(root, ctx.file)

      for (const id in modulesById) {
        if (modulesById[id].isMatch(file))
          ctx.modules.push(server.moduleGraph.getModuleById(id)!)
      }
    },
  }
}
