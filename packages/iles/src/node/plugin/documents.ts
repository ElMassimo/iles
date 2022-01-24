import { Plugin, ViteDevServer } from 'vite'

import glob from 'fast-glob'
import { isMatch } from 'micromatch'
import { relative } from 'pathe'
import type { AppConfig } from '../shared'
import { parseId } from './parse'
import { debug, serialize } from './utils'

const definitionRegex = /(function|const|let|var)[\s\n]+\buseDocuments\b/
const usageRegex = /\buseDocuments[\s\n]*\(([^)]+)\)/g

const fileCanUseDocuments = /(\.vue|\.[tj]sx?)$/

const DOCS_VIRTUAL_ID = '/@islands/documents'

interface DocumentModule {
  pattern: string
  hasDocument: (path: string) => boolean
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
      if (server)
        modulesById[id] = { pattern, hasDocument: path => isMatch(path, pattern) }

      // Obtain files matching the specified pattern and extract frontmatter.
      const files = await glob(pattern, { cwd: root })
      const data = await Promise.all(files.map(async file =>
        pages.api.pageForFilename(file)?.frontmatter || pages.api.frontmatterForFile(file)))

      debug.documents('%s %O', rawPath, { path, pattern, files })

      // Create the structure of each document in the default export.
      const documents = data.map(({ route: _, meta, layout, ...frontmatter }, index) => {
        meta.filename ||= files[index]
        return { ...meta, ...frontmatter, meta, frontmatter, component: `${index}_component` }
      })

      // Serialize all the documents, adding a `component` factory function.
      const serialized = serialize(documents).replace(/component:"(\w+)"/g, (_, id) => {
        const index = id.split('_component')[0]
        return `component: unwrapDefault(() => import('/${documents[index].filename}'))`
      })

      // Use defineAsyncComponent to support using <component :is="doc">.
      // HMR works by updating the value of the computed ref, while preserving
      // any previously resolved component promises to avoid refetching.
      return `
        import { shallowRef, defineAsyncComponent } from 'vue'

        export const documents = ${serialized}
          .map(doc => ({ ...doc, ...defineAsyncComponent(doc.component) }))

        export default documents.ref = shallowRef(documents)

        function unwrapDefault (fn) {
          let cached
          return () => cached ||= fn().then(mod => mod.default)
        }

        if (import.meta.hot) {
          import.meta.hot.accept(mod => {
            const docs = documents.ref.value
            const oldDocsByFile = {}
            docs.forEach(doc => { oldDocsByFile[doc.filename] = doc })

            documents.ref.value = mod.documents.map(newDoc => {
              const oldDoc = oldDocsByFile[newDoc.filename]
              if (!oldDoc) return newDoc
              const { meta, frontmatter } = newDoc
              return Object.assign(oldDoc, { ...meta, ...frontmatter, meta, frontmatter })
            })

            mod.documents.ref = documents.ref
          })
        }
      `
    },
    async transform (code, id) {
      // Ensure Vite keeps track of files imported by the documents pattern.
      if (server && id.startsWith(DOCS_VIRTUAL_ID)) {
        (server as any)._globImporters[id] = {
          module: server.moduleGraph.getModuleById(id),
          importGlobs: [{ base: root, pattern: modulesById[id].pattern }],
        }
        return
      }

      // Replace each usage of useDocuments with an import of a virtual module.
      if (fileCanUseDocuments.test(id) && !definitionRegex.test(code)) {
        const paths: [string, string][] = []
        code = code.replace(usageRegex, (_, path) => {
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
    handleHotUpdate (ctx) {
      const file = relative(root, ctx.file)

      for (const id in modulesById) {
        if (modulesById[id].hasDocument(file))
          ctx.modules.push(server.moduleGraph.getModuleById(id)!)
      }
    },
  }
}
